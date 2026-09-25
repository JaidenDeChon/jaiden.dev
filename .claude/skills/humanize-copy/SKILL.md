---
name: humanize-copy
description: Run the copy-humanizer agent on a loop, one file at a time, so every sentence and label on jaiden.dev is checked against the humanizer skill and rewritten to sound like Jaiden, and to make sense to a first-time reader, without losing details. Use when asked to humanize the site, clean up AI-sounding copy, UI text, project write-ups, resume bullets or pricing copy, or run the humanizer loop. Optional args are a file path to do just that one, a number N to stop after N files, or an area (`chrome`, `projects`, `resume`, `pricing`, `blog`) to work only that part of the site.
---

# Humanize the site's copy on a loop

Drives `.claude/agents/copy-humanizer.md` one file at a time. The agent takes the next item from `python3 scripts/humanize_copy.py next`, goes through it sentence by sentence (or string by string) with `.claude/skills/humanizer/SKILL.md`, verifies with `scripts/humanize_copy.py check` and ESLint on the file, reprints the resume PDF when a resume file changed, records the item in `.claude/humanized-copy.json`, and commits locally. This skill repeats that and pushes the results.

The queue walks the site in the order a visitor meets it, one area after another: `chrome` (the homepage hero, share description, header, footer, contact dialog and the contact API's error messages, then the rest of the homepage), `projects` (the project list, the project page header, then each project's page followed by its Markdown spotlight), `resume` (`lib/data/resume.ts`, then the page and its components), `pricing` (the pricing data, page and components, then the comparison data and charts, then the FAQ) and `blog` (the post list and page). Within an area, source files come before the article they sit on, so that an article can refer to a button by its final name. Any new page, component, content file or data file that matches the script's `CATCH_ALL` patterns joins the end of the queue on its own. After every item is done once, an item whose content changed since it was humanized comes back into the queue.

The script never offers the memorial post `content/blog-posts/hayden-kvaale.md`, the `cake` test fixture, the shadcn-vue components in `components/ui/`, the `*-enums.ts` files or anything under `public/` and `scripts/`. The agent explains why in `.claude/agents/copy-humanizer.md`.

## Arguments

- **A file path:** run the agent once on that file, then stop.
- **An area** (`chrome`, `projects`, `resume`, `pricing` or `blog`, optionally followed by N): work only that area, with `next --area <area>` and `status --area <area>`.
- **A number N:** stop after N items.
- **No arguments:** keep going until the agent reports `ALL DONE`, or something blocks.

## Before the first iteration

Run `python3 scripts/humanize_copy.py status` (with `--area <area>` when one was given) and tell the user how many items are done and how many remain. If `node_modules` is missing, run `bun install --frozen-lockfile` once so every agent can lint its file. `bun run lint` over the whole repo is already red at `HEAD` (mostly the shadcn-vue components), so the agents compare their one file with `HEAD` instead of expecting a clean repo-wide run.

## Each iteration

1. Dispatch the `copy-humanizer` agent in the foreground, one at a time. Pass the path if one was given; otherwise give no target (and when working an area, tell it which). Never let parallel runs pick their own "next" item: they would take the same one and collide on the ledger.
   - Markdown spotlights in `content/project-spotlights/` may run in parallel batches if each agent is given an explicit, distinct path and told not to record or commit. After the batch, for each file: run `check`, spot-check it (step 3), then `record` and commit it yourself, one commit per file. Source files (`.vue`, `.ts`) always run one at a time, because later files and the spotlights depend on the names they settle on. Resume items always run one at a time too, because they share one PDF.
2. Read its report:
   - **`ALL DONE`** → stop.
   - **A blocker** (uncommitted changes on the file, a check it could not pass without losing meaning, a resume PDF it could not print, the memorial post) → tell the user what's blocking and stop. Don't retry blindly.
3. Spot-check the commit. `git show --stat HEAD` must touch only that file and the ledger. The exceptions: a resume item may also touch `public/jaiden_dechon_resume.pdf` (and a separate commit before it may touch the slice constants in `pages/resume.vue`), and any item may touch a test that asserts its wording. Then skim `git show HEAD -- "<path>"` for a changed fact, a dropped condition in a pricing term, a resume claim made stronger or weaker ("helped" turned into "led"), a changed job title, employer, date or metric, or an opinion of Jaiden's that was flattened out. If you find one, fix it in a follow-up commit before moving on. For a resume commit, confirm the PDF is in it only if its extracted text changed, as CLAUDE.md requires.
4. Push every 10 items, and at the end: `git push -u origin <current branch>`. If there's no open PR for the branch, open one, with the "How to test" steps a reviewer needs (the check command, `bunx eslint` on the changed files, `bun run resume:pdf` for resume changes, and the pages to look at). Never push to the default branch.
5. Give the user a one-line status per item: path, sentences or strings changed, main patterns removed. For a source file, list any renamed control or reworded repeated sentence, and pass that to every later agent in the sweep so the text that mentions it (or its twin, such as the hero sentence and the share description in `app.vue`) uses the new wording. For a resume item, say whether the PDF changed.

## Pacing

Each item is a small run and there are about sixty, so one session can usually finish an area. The resume items are slower, because each change reprints the PDF with a dev server and a headless browser. For an unattended sweep, prefer `/loop /humanize-copy 10` or a scheduled Routine that invokes this skill with a number, so each firing does a batch in a fresh context.
