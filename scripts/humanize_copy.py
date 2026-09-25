#!/usr/bin/env python3
"""Queue, ledger and detail guard for the copy-humanizer agent.

The agent rewrites the words on one file of the site at a time with the
humanizer skill. This script picks the file, checks that the rewrite kept every
detail and left the code alone, and records the file as done.

    python3 scripts/humanize_copy.py next                  # print the next item to humanize
    python3 scripts/humanize_copy.py status                # counts: done, stale, remaining
    python3 scripts/humanize_copy.py next --area resume    # next item in one area of the site
    python3 scripts/humanize_copy.py status --area resume
    python3 scripts/humanize_copy.py check PATH            # compare PATH with its HEAD version
    python3 scripts/humanize_copy.py record PATH           # mark PATH as humanized

Paths are relative to the repo root, e.g. "content/project-spotlights/lucy-vpms.md".
Areas are the parts of the site a reader moves through: chrome (header,
footer, homepage, contact dialog), projects, resume, pricing and blog.

For a Markdown article, `check` splits the page into locked parts (frontmatter,
headings, code, MDC component directives) and prose, then fails if a link
target, number, quotation or inline code span was lost or added.

For a source file (.vue or .ts), `check` masks every string literal and every
piece of template text that reads as copy, then requires the rest of the file
(the code) to be unchanged. <style> blocks must be unchanged too. Strings that
are data rather than copy (URLs, icons, paths, ids, job titles, employers,
dates, tech names, plan names...) are kept visible through LOCKED_KEYS and
LOCKED_CONSTS, so changing one fails the check. Numbers, links and quotations
inside the copy are then compared the same way as in an article.

`check` exits 1 when the rewrite broke a hard rule. It also prints warnings
(capitalised words, italic spans or spelled-out numbers that vanished) for the
agent to review by hand; warnings alone exit 0.
"""

from __future__ import annotations

import difflib
import hashlib
import json
import re
import subprocess
import sys
from collections import Counter
from datetime import datetime, timezone
from fnmatch import fnmatch
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LEDGER = ROOT / ".claude" / "humanized-copy.json"

# ---------------------------------------------------------------- queue ---

# Every file that puts words in front of a reader, in the order a visitor
# meets them, grouped by area. Source files come before the article they sit
# on, so that an article's prose can use the final name of a button.
AREAS: dict[str, list[str]] = {
    "chrome": [
        "components/homepage/hero-text.vue",
        "app.vue",  # the site-wide share description repeats the hero sentence
        "components/global/app-header.vue",
        "components/global/theme-switch.vue",
        "components/global/app-footer.vue",
        "components/global/contact-dialog.vue",
        "server/api/contact.post.ts",  # its error messages show in the contact dialog
        "components/homepage/hero-pane.vue",
        "components/homepage/technologies-list.vue",
        "components/homepage/my-projects.vue",
        "components/homepage/my-blog-posts.vue",
        "components/global/article-card.vue",
        "pages/index.vue",
    ],
    "projects": [
        "lib/constants/projects/projects-list.ts",
        "components/project-showcase/project-showcase-title-area.vue",
        "pages/project/lucy-vpms.vue",
        "content/project-spotlights/lucy-vpms.md",
        "pages/project/jaiden-dot-dev.vue",
        "content/project-spotlights/jaiden-dot-dev.md",
        "pages/project/aris-maye.vue",
        "content/project-spotlights/aris-maye.md",
        "pages/project/psy-kick.vue",
        "content/project-spotlights/psy-kick.md",
        "pages/project/uap-gerb-knowledge-base.vue",
        "pages/project/self-aware-grid.vue",
        "content/project-spotlights/self-aware-grid.md",
        "components/content/ArticleFigure.vue",
        "components/content/ArticleImagePair.vue",
        "components/content/ArticleVideo.vue",
    ],
    # Every resume item feeds public/jaiden_dechon_resume.pdf, which has to be
    # reprinted with `bun run resume:pdf` after a change (see CLAUDE.md).
    "resume": [
        "lib/data/resume.ts",
        "pages/resume.vue",
        "components/resume/resume-header.vue",
        "components/resume/resume-section.vue",
        "components/resume/resume-job.vue",
        "components/resume/resume-project.vue",
        "components/resume/resume-skills.vue",
        "components/resume/resume-reference.vue",
        "components/resume/resume-links.vue",
        "components/resume/resume-bullets.vue",
        "components/resume/resume-course.vue",
        "components/resume/resume-certification.vue",
        "components/resume/resume-rich-text.vue",
        "components/resume/resume-page.vue",
        "components/resume/resume-download-button.vue",
    ],
    "pricing": [
        "lib/data/pricing.ts",
        "pages/pricing.vue",
        "components/pricing/pricing-hero.vue",
        "components/pricing/pricing-plan-card.vue",
        "components/pricing/pricing-alacarte.vue",
        "components/pricing/pricing-cta.vue",
        "lib/data/marketComparison.ts",
        "components/pricing/pricing-compare.vue",
        "components/pricing/pricing-compare-bar.vue",
        "components/pricing/pricing-compare-line.vue",
        "components/pricing/pricing-compare-matrix.vue",
        "components/pricing/pricing-faq.vue",
    ],
    "blog": [
        "lib/constants/blog-posts/blog-post-list.ts",
        "pages/blog/hayden-kvaale.vue",
    ],
}

# Anything matching these that is not listed above joins the queue at the end,
# alphabetically, so a new page or component is not missed.
CATCH_ALL = ["app.vue", "pages/**/*.vue", "components/**/*.vue", "content/**/*.md",
             "lib/data/*.ts", "lib/constants/**/*-list.ts", "server/api/**/*.ts",
             "layouts/**/*.vue", "error.vue"]

# Never offered, whatever the pattern above says.
NEVER = [
    "components/ui/**",                         # shadcn-vue registry code, not this site's copy
    "content/project-spotlights/cake.md",       # Markdown test fixture, not linked from the site
    "pages/project/cake.vue",
    "content/blog-posts/hayden-kvaale.md",      # a memorial in Jaiden's own words; see copy-humanizer.md
    "lib/constants/**/*-enums.ts",              # display names that double as lookup keys
    "public/**", "scripts/**", "node_modules/**", ".nuxt/**", ".output/**",
]


def rel(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def matches(path: str, patterns: list[str]) -> bool:
    return any(fnmatch(path, p) or (p.endswith("/**") and path.startswith(p[:-2])) for p in patterns)


def tracked_files() -> list[str]:
    out = subprocess.run(["git", "ls-files"], cwd=ROOT, check=True, capture_output=True, text=True).stdout
    return out.splitlines()


def all_items(area: str | None = None) -> list[Path]:
    listed = [p for name, paths in AREAS.items() if area in (None, name) for p in paths]
    items = list(dict.fromkeys(listed))
    if area is None:
        known = {p for paths in AREAS.values() for p in paths}
        extra = sorted(f for f in tracked_files() if matches(f, CATCH_ALL) and f not in known)
        items += extra
    return [ROOT / p for p in items
            if not matches(p, NEVER) and (ROOT / p).is_file() and (ROOT / p).stat().st_size > 0]


def area_of(path: str) -> str | None:
    return next((name for name, paths in AREAS.items() if path in paths), None)


def load_ledger() -> dict:
    if LEDGER.exists():
        return json.loads(LEDGER.read_text(encoding="utf-8"))
    return {}


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def classify(area: str | None = None) -> tuple[list[Path], list[Path], list[Path]]:
    """Split items into (never done, changed since done, done and unchanged)."""
    ledger = load_ledger()
    new, stale, done = [], [], []
    for item in all_items(area):
        entry = ledger.get(rel(item))
        if entry is None:
            new.append(item)
        elif entry.get("sha256") != sha(item):
            stale.append(item)
        else:
            done.append(item)
    return new, stale, done


def cmd_next(area: str | None) -> int:
    new, stale, _ = classify(area)
    queue = new + stale
    if not queue:
        print("ALL DONE")
        return 0
    print(rel(queue[0]))
    return 0


def cmd_status(area: str | None) -> int:
    new, stale, done = classify(area)
    print(f"done: {len(done)}  never humanized: {len(new)}  changed since humanized: {len(stale)}")
    return 0


def cmd_record(path: Path) -> int:
    ledger = load_ledger()
    ledger[rel(path)] = {
        "humanized_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "sha256": sha(path),
    }
    LEDGER.parent.mkdir(parents=True, exist_ok=True)
    LEDGER.write_text(json.dumps(dict(sorted(ledger.items())), indent=2, ensure_ascii=False) + "\n",
                      encoding="utf-8")
    print(f"recorded {rel(path)}")
    return 0


# ------------------------------------------------------- facts in prose ---

URL_RE = re.compile(r"\]\([^)]+\)|https?://[^\s\"'`)<>]+|mailto:[^\s\"'`)<>]+|tel:[^\s\"'`)<>]+|\b[\w.+-]+@[\w-]+\.[\w.]+\b")
NUMBER_RE = re.compile(r"(?<![\w.])\d[\d,]*(?:\.\d+)?")
QUOTE_RE = re.compile(r"\"([^\"\n]{3,})\"|“([^”\n]{3,})”")
INLINE_CODE_RE = re.compile(r"`[^`\n]+`")
ITALIC_RE = re.compile(r"(?<![*\w])\*([^*\n]+)\*(?![*\w])|(?<!\w)_([^_\n]+)_(?!\w)")
# Capitalised words mid-sentence: likely names, products, titles and places.
# Words that open a sentence are skipped because rewording moves them freely.
CAP_RE = re.compile(r"(?<=[\w,;:)\]] )[A-Z][A-Za-z0-9'’.+#-]*[A-Za-z0-9+#]")
NUMBER_WORD_RE = re.compile(
    r"\b(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|twenty|thirty|"
    r"forty|fifty|hundred|thousand|million|billion|first|second|third|fourth|fifth|"
    r"once|twice|half|dozen|single|double|triple)\b", re.I)


def facts(prose: str) -> dict[str, Counter]:
    italics = Counter(a or b for a, b in ITALIC_RE.findall(prose))
    quotes = Counter(a or b for a, b in QUOTE_RE.findall(prose))
    code = Counter(INLINE_CODE_RE.findall(prose))
    bare = INLINE_CODE_RE.sub(" ", URL_RE.sub(" ", prose))
    return {
        "links": Counter(URL_RE.findall(prose)),
        "numbers": Counter(n.replace(",", "") for n in NUMBER_RE.findall(bare)),
        "quotes": quotes,
        "inline code": code,
        "italics": italics,
        "capitalised": Counter(CAP_RE.findall(bare)),
        "number words": Counter(w.lower() for w in NUMBER_WORD_RE.findall(bare)),
    }


HARD = ("links", "numbers", "quotes", "inline code")
SOFT = ("italics", "capitalised", "number words")


def show(counter: Counter) -> str:
    return ", ".join(f"{k!r}" + (f" x{v}" if v > 1 else "") for k, v in sorted(counter.items()))


def compare_facts(old_prose: str, new_prose: str, errors: list[str], warnings: list[str]) -> None:
    before, after = facts(old_prose), facts(new_prose)
    for kind in HARD:
        lost, gained = before[kind] - after[kind], after[kind] - before[kind]
        if lost:
            errors.append(f"{kind} lost: {show(lost)}")
        if gained:
            errors.append(f"{kind} added: {show(gained)}")
    for kind in SOFT:
        lost = before[kind] - after[kind]
        # A word may survive in a new position (a sentence start, a new
        # case), so warn only when it is gone entirely. Review, not failure.
        lost = Counter({k: v for k, v in lost.items() if k.lower() not in new_prose.lower()})
        if lost:
            warnings.append(f"{kind} no longer present: {show(lost)}")


def report(errors: list[str], warnings: list[str], hint: str) -> int:
    for w in warnings:
        print(f"WARNING {w}")
    for e in errors:
        print(f"ERROR {e}")
    if errors:
        return 1
    print("ok" + (" (review the warnings above)" if warnings else "") + hint)
    return 0


# ---------------------------------------------------- Markdown articles ---

# Attributes of an MDC block component (::article-figure{...}) whose values a
# reader sees or hears. Every other attribute (src, left-src...) stays locked.
MDC_COPY_ATTRS = ("alt", "caption", "title", "left-alt", "right-alt", "label", "description")
MDC_ATTR_RE = re.compile(r"((?<![\w-])(?:" + "|".join(MDC_COPY_ATTRS) + r')=)"([^"]*)"')


def split_markdown(text: str) -> tuple[str, list[str], str]:
    """Return (frontmatter, locked lines, editable prose).

    Locked lines must survive byte for byte and in order: headings, fences and
    code, MDC component directives (with their copy attributes blanked out),
    a component's YAML props, and tables' separator rows.
    """
    frontmatter = ""
    m = re.match(r"\A---\n.*?\n---\n", text, re.DOTALL)
    if m:
        frontmatter, text = m.group(0), text[m.end():]

    locked: list[str] = []
    prose: list[str] = []
    fence = ""
    in_yaml = False
    depth = 0
    for line in text.splitlines():
        stripped = line.strip()
        if fence:
            locked.append(line)
            if stripped.startswith(fence):
                fence = ""
            continue
        fm = re.match(r"^(`{3,}|~{3,})", stripped)
        if fm:
            fence = fm.group(1)
            locked.append(line)
            continue
        if re.match(r"^:{2,}[\w-]", stripped):
            depth += 1
            in_yaml = False
            for am in MDC_ATTR_RE.finditer(line):
                prose.append(am.group(2))
            locked.append(MDC_ATTR_RE.sub(r'\1"…"', line))
            continue
        if re.match(r"^:{2,}$", stripped):
            depth = max(0, depth - 1)
            locked.append(line)
            continue
        if depth and stripped == "---":
            in_yaml = not in_yaml
            locked.append(line)
            continue
        if in_yaml:
            locked.append(line)
            continue
        if re.match(r"^#{1,6}\s", stripped) or re.match(r"^\|?\s*:?-{3,}", stripped):
            locked.append(line)
            continue
        if re.match(r"^\s*<!--.*-->\s*$", line):
            locked.append(line)
            continue
        prose.append(line)
    return frontmatter, locked, "\n".join(prose)


def cmd_check_markdown(old: str, new: str) -> int:
    old_fm, old_locked, old_prose = split_markdown(old)
    new_fm, new_locked, new_prose = split_markdown(new)
    errors: list[str] = []
    warnings: list[str] = []

    if old_fm != new_fm:
        errors.append("frontmatter changed; it must stay byte for byte")
    if old_locked != new_locked:
        diff = [line for line in difflib.unified_diff(old_locked, new_locked, lineterm="", n=0)
                if line.startswith(("+", "-")) and not line.startswith(("+++", "---"))]
        errors.append("headings, code, component directives or component props changed (only prose and the "
                      + "/".join(MDC_COPY_ATTRS) + " attributes of a component may change):"
                      + ("".join(f"\n    {line}" for line in diff[:20]) or " order differs"))
    compare_facts(old_prose, new_prose, errors, warnings)
    return report(errors, warnings, "")


# -------------------------------------------------- .vue and .ts sources ---

# Keys whose string values are data, not copy, in every source file.
LOCKED_KEYS = {"url", "href", "src", "icon", "image", "path", "to", "id", "key", "type", "planId",
               "iconColor", "lang", "tags", "dateRange", "date", "company", "location", "provider",
               "certificateNumber", "completionDate", "retrieved"}
# Extra locked keys per file (glob): job and certificate titles, names of
# people, projects, plans and technologies.
FILE_LOCKED_KEYS = {
    "lib/data/resume.ts": {"title", "name", "role"},
    "lib/data/pricing.ts": {"name"},
    "pages/project/*.vue": {"name"},
    "components/homepage/technologies-list.vue": {"name"},
}
# Whole constants that are data even though some of their strings look like
# copy: the resume's name, tagline, contact details, skills, links, references,
# courses and certifications, and the phone number.
FILE_LOCKED_CONSTS = {
    "lib/data/resume.ts": {"RESUME_NAME_LINES", "RESUME_TAGLINE", "RESUME_CONTACT_ROWS", "RESUME_SKILLS",
                           "RESUME_REFERENCES", "RESUME_LINKS", "RESUME_COURSES", "RESUME_CERTIFICATIONS"},
    "lib/data/pricing.ts": {"PHONE"},
}

# Comments come first so an apostrophe in a comment never opens a string.
STRING_RE = re.compile(r"//[^\n]*|/\*.*?\*/|'(?:[^'\\\n]|\\.)*'|\"(?:[^\"\\\n]|\\.)*\"|`(?:[^`\\]|\\.)*`", re.S)
# Static attributes whose values a reader sees or hears.
TEXT_ATTR_RE = re.compile(r"(?<![:@\w-])((?:aria-label|aria-description|title|subtitle|caption|placeholder|alt|"
                          r"label|description)=)\"([^\"]*)\"")
TEXT_NODE_RE = re.compile(r">([^<>\"=]*)<")
MUSTACHE_RE = re.compile(r"\{\{.*?\}\}", re.S)
BOUND_ATTR_RE = re.compile(r"((?:[:@#]|v-)[\w:.-]*=)\"([^\"]*)\"")
TEMPLATE_EXPR_RE = re.compile(r"\$\{[^}]*\}")
# The key a string is the value of ("url: '...'"), or the key of the array it
# sits in ("tags: ['Nuxt', '...'"). The nearest key wins.
KEY_BEFORE_RE = re.compile(r"(\w+)['\"]?\s*:\s*$")
ARRAY_KEY_BEFORE_RE = re.compile(r"(\w+)['\"]?\s*:\s*\[[^\[\]{}]*$")

# Single-word strings that are code, not copy: keyboard keys and the like.
CODE_WORDS = {"Enter", "Escape", "Tab", "Home", "End", "Space", "Backspace", "Delete",
              "PageUp", "PageDown", "Shift", "Control", "Alt", "Meta", "Root"}


def is_class_list(text: str) -> bool:
    """True for a string of CSS classes ('w-full rounded-md px-3'), which is
    code even though it holds spaces."""
    tokens = text.split()
    return (bool(tokens) and all(re.fullmatch(r"[a-z0-9:/\[\]().%_!#&>*~+,-]+", t) for t in tokens)
            and sum(bool(re.search(r"[-:]", t)) for t in tokens) * 2 >= len(tokens))


class Masker:
    """Blanks out everything a copy edit may change, so what is left is code,
    and collects the blanked copy so its facts can be compared."""

    def __init__(self, path: str) -> None:
        self.keys = set(LOCKED_KEYS)
        for pattern, keys in FILE_LOCKED_KEYS.items():
            if fnmatch(path, pattern):
                self.keys |= keys
        self.consts = set().union(*(c for p, c in FILE_LOCKED_CONSTS.items() if fnmatch(path, p)))
        self.copy: list[str] = []

    def locked_spans(self, text: str) -> list[tuple[int, int]]:
        spans = []
        for name in self.consts:
            m = re.search(rf"^(?:export\s+)?const\s+{name}\b", text, re.M)
            if not m:
                continue
            end = re.compile(r"^(?:export\s+|const\s|function\s|interface\s|type\s|let\s)", re.M).search(text, m.end())
            spans.append((m.start(), end.start() if end else len(text)))
        return spans

    def strings(self, text: str) -> str:
        """Mask the string literals that read as copy: they hold a space or an
        ellipsis, or are one capitalised word. Ids, class names, keys, paths
        and locked values stay visible to the check."""
        spans = self.locked_spans(text)

        def one(m: re.Match) -> str:
            lit = m.group(0)
            if lit.startswith("/"):
                return lit
            if any(a <= m.start() < b for a, b in spans):
                return lit
            before = text[max(0, m.start() - 300):m.start()]
            key = KEY_BEFORE_RE.search(before) or ARRAY_KEY_BEFORE_RE.search(before)
            if key and key.group(1) in self.keys:
                return lit
            body = lit[1:-1]
            if re.search(r"<[a-z][^>]*>", body):
                # HTML (an email body, a <br />): mask it like markup, so its
                # tags, attributes and styles stay code.
                return lit[0] + self.markup(body, TEMPLATE_EXPR_RE) + lit[-1]
            words = TEMPLATE_EXPR_RE.sub("", body) if lit[0] == "`" else body
            bare = words.strip()
            is_copy = (re.search(r"[A-Za-z]", words) and (" " in bare or "…" in words or "(" in bare)
                       or (re.fullmatch(r"[A-Z][a-z]+[.!?…]*", bare) and bare not in CODE_WORDS))
            if not is_copy or is_class_list(bare):
                return lit
            self.copy.append(words)
            if lit[0] == "`":
                # Keep the ${...} expressions visible: they are code.
                return "`" + "§".join(TEMPLATE_EXPR_RE.findall(body)) + "§S§`"
            return "§S§"

        return STRING_RE.sub(one, text)

    def text_node(self, node: str, expr_re: re.Pattern) -> str:
        """Mask the words in a text node. Its {{ }} or ${ } expressions are
        code, so they must survive in the same order; the words may move."""
        words = expr_re.sub("", node)
        exprs = expr_re.findall(node)
        if not re.search(r"[A-Za-z]", words) and not (exprs and words.strip()):
            return node
        self.copy.append(words)
        return "§T§" + "".join(exprs)

    def markup(self, block: str, expr_re: re.Pattern = MUSTACHE_RE) -> str:
        if expr_re is MUSTACHE_RE:
            block = MUSTACHE_RE.sub(lambda m: self.strings(m.group(0)), block)
            block = BOUND_ATTR_RE.sub(lambda m: m.group(1) + '"' + self.strings(m.group(2)) + '"', block)

        def attr(m: re.Match) -> str:
            self.copy.append(m.group(2))
            return m.group(1) + '"§A§"'

        block = TEXT_ATTR_RE.sub(attr, block)
        return TEXT_NODE_RE.sub(lambda m: ">" + self.text_node(m.group(1), expr_re) + "<", block)

    def code(self, text: str, vue: bool) -> str:
        if not vue:
            return self.strings(text)
        out = []
        # Split into top-level blocks; <template> is masked as markup, <script> as code.
        for block in re.split(r"(?=^<(?:template|script|style)\b)", text, flags=re.M):
            if block.startswith("<script"):
                out.append(self.strings(block))
            elif block.startswith("<template"):
                out.append(self.markup(block))
            else:
                out.append(block)
        return "".join(out)


def cmd_check_code(path: str, old: str, new: str) -> int:
    vue = path.endswith(".vue")
    errors: list[str] = []
    warnings: list[str] = []
    if vue:
        def styles(t: str) -> list[str]:
            return re.findall(r"^<style\b.*?^</style>", t, re.S | re.M)
        if styles(old) != styles(new):
            errors.append("<style> changed; only user-facing text may change")
    old_mask, new_mask = Masker(path), Masker(path)
    old_code, new_code = old_mask.code(old, vue).splitlines(), new_mask.code(new, vue).splitlines()
    if old_code != new_code:
        diff = [line for line in difflib.unified_diff(old_code, new_code, lineterm="", n=0)
                if line.startswith(("+", "-")) and not line.startswith(("+++", "---"))]
        errors.append("code or a locked value changed (only user-facing text may change; URLs, icons, ids, "
                      "names, titles, dates and tech names are locked):" + "".join(f"\n    {line}" for line in diff[:20]))
    compare_facts("\n".join(old_mask.copy), "\n".join(new_mask.copy), errors, warnings)
    hint = (f"\nnext: bunx eslint {path} (it must report no problem the file did not already have at HEAD;"
            " `bun run lint` over the whole repo is already red)")
    if area_of(path) == "resume":
        hint += ("\nthen: bun run resume:pdf, and compare the PDF's text with HEAD's as CLAUDE.md describes"
                 " before committing it")
    return report(errors, warnings, hint)


def cmd_check(path: Path) -> int:
    try:
        old = subprocess.run(["git", "show", f"HEAD:{rel(path)}"], cwd=ROOT, check=True,
                             capture_output=True, text=True).stdout
    except subprocess.CalledProcessError:
        print(f"{rel(path)} is not in HEAD; commit it before humanizing.")
        return 1
    new = path.read_text(encoding="utf-8")
    if old == new:
        print("unchanged")
        return 0
    if path.suffix in (".vue", ".ts"):
        return cmd_check_code(rel(path), old, new)
    if path.suffix == ".md":
        return cmd_check_markdown(old, new)
    print(f"don't know how to check a {path.suffix} file")
    return 2


def main(argv: list[str]) -> int:
    if len(argv) < 2 or argv[1] not in {"next", "status", "check", "record"}:
        print(__doc__)
        return 2
    cmd = argv[1]
    if cmd in ("next", "status"):
        area = None
        if "--area" in argv:
            i = argv.index("--area")
            area = argv[i + 1] if i + 1 < len(argv) else ""
            if area not in AREAS:
                print(f"unknown area {area!r}; choose one of: {', '.join(AREAS)}")
                return 2
        return cmd_next(area) if cmd == "next" else cmd_status(area)
    if len(argv) != 3:
        print(f"usage: {argv[0]} {cmd} PATH")
        return 2
    path = (ROOT / argv[2]).resolve()
    if not path.is_file():
        print(f"no such file: {argv[2]}")
        return 2
    return cmd_check(path) if cmd == "check" else cmd_record(path)


if __name__ == "__main__":
    sys.exit(main(sys.argv))
