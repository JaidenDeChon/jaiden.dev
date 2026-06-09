## Building My Corner of the Web

Every developer eventually builds their own portfolio site. Some do it early — a way to show potential employers something beyond a resume. Others put it off indefinitely. I was somewhere in between: I had projects to show, a story to tell, and a nagging sense that the portfolio I'd built years ago was overdue for a real rethink.

jaiden.dev is that rethink.

## Starting with the Stack

I've been writing Vue for years. The choice to build on Vue 3 and Nuxt 3 was instinctive — they're the tools I'm most fluent in, and Nuxt added exactly what I needed on top of Vue: file-based routing that just works, server-side rendering, image optimization, an icon system, and a strong module ecosystem. Configuration that used to take a weekend took an afternoon.

For the content side of things, I reached for `@nuxt/content`. Writing project writeups in Markdown and having them render with full Tailwind Typography styling felt like the right balance of simplicity and power. The article you're reading right now is just a `.md` file living in the repo.

## The Component Library Question

This is where it got interesting.

My original plan was to use NuxtUI Pro — a polished set of page-layout components (heroes, sections, feature grids, pricing tables) that would have made spinning up a portfolio fast. The components are genuinely impressive. But NuxtUI Pro requires a paid license for production use, and I wanted to keep jaiden.dev completely open-source.

That led me to `shadcn-nuxt`, which brings the shadcn approach to Nuxt. If you haven't encountered shadcn before: it's not a traditional component library. Rather than installing a package and importing black-box components, you generate component source code directly into your own project. Each component is built on [Radix Vue](https://www.radix-vue.com) for accessibility and Tailwind CSS for styling — and once it's in your codebase, it's yours to change however you like.

The trade-off is real. There's no built-in PageHero or PageSection to drop in. You build the layouts yourself using Tailwind and whatever components you've generated. For a site this personal, I actually preferred it that way. The layout reflects exactly what I wanted, not what a library decided a portfolio should look like.

## The Globe

The most visually distinctive thing on the homepage is the 3D globe, built using [`globe.gl`](https://globe.gl) and Three.js. It shows a rotating Earth with pulsing rings on real-world coordinates, animated arcs flying between locations, and a cloud of orbit particles scattered around it.

In light mode, the globe colors are inverted at the CSS level — a `filter: invert()` trick that keeps the same texture and WebGL rendering intact while adapting the look to the brighter theme.

The globe is wrapped in a `<client-only>` tag so it renders exclusively in the browser and doesn't interfere with server-side rendering.

## Dark Mode

Color mode support comes from `@nuxtjs/color-mode`. The site defaults to the system preference and falls back to light if one isn't set. The switcher in the header cycles through light, dark, and system.

The brand yellow you see in tags and accents throughout the site is a CSS custom property threaded through the Tailwind config (`--brand-yellow`). Keeping it in one place means adjusting the whole palette is a single-line change.

## The Project Article System

Each project page pulls metadata from a central constants file — title, description, tags, related links, and a cover image. That data drives the homepage cards and the project header at the top of each spotlight page. The article text itself lives in one or more Markdown files inside `content/`, rendered via `<ContentDoc />` from Nuxt Content.

The split between metadata and content makes it easy to update one without touching the other. Adding a new project is as straightforward as adding an entry to the constants file and dropping a Markdown file in the right folder.

## Small Details

A few things that don't deserve their own section but are worth noting:

- **Listen button** — each project page has a "Listen" button that uses the Web Speech API to read the project title, description, and tags aloud.
- **Share button** — the native Web Share API lets you share a project page from the device's native share sheet.
- **Card hover effects** — project cards on the homepage lift slightly with a shadow on hover, and the cover image scales up a touch using a CSS `group-hover` transition.
- **Custom breakpoints** — Tailwind's default breakpoints stop at `2xl`, but the site extends them all the way to `7xl` for large-display support, because apparently I expect some people to view this on a movie theater screen.

The goal was a site that feels considered — not just a list of projects thrown on a page, but a real representation of how I think about building things.
