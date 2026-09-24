# AGENTS.md

Instructions for coding agents working in this repository. Human-facing setup is in [README.md](README.md); the visual specification is [docs/design.md](docs/design.md).

## Project

- English technical blog at `https://blog.koji-1009.com`, moved from Medium.
- Astro, fully static output, no adapter. Served by Cloudflare Workers static assets (`wrangler.jsonc`) through Workers Builds.
- Look up Astro APIs in the official documentation (https://docs.astro.build) before using them; do not write them from memory. Astro 7 renders Markdown with Sätteri, not remark/rehype.

## Architecture

Follow [Crumple Zone Architecture](https://github.com/koji-1009/crumple-zone-architecture): the `crz` skill (`skill/crz.md`) when writing Astro code and the `sieve` skill (`skill/sieve.md`) when styling. This site is fully static, so the parts of CRZ that assume `output: 'server'` (middleware, Actions, sessions, `500.astro`, server islands) do not apply.

```
src/
  content.config.ts            — posts collection schema
  content/posts/<slug>/        — index.md and its images
  pages/                       — routes: skeleton and composition only; per-page styles in _<page>.module.css
  layouts/                     — Base (document, header, footer), Post (post page), Page (Markdown pages such as pages/about.md)
  components/                  — site-wide components (SiteHeader, SiteFooter)
  features/posts/
    data/posts.ts              — the only reader of the posts collection; called from frontmatter and endpoints
    components/                — post display (Timeline, PostMeta, TagList, Prose)
  shared/lib/                  — generic utilities (dates) and site constants
  styles/                      — tokens.css, global.css
```

Extract every nameable section into a component with its own `*.module.css`; keep inline HTML for the skeleton only.

## Decisions

- **Site URL** is set only in `site` in `astro.config.mjs`. Never hard-code it elsewhere; derive it from `Astro.site` / `context.site` (this is why `robots.txt` is an endpoint, not a file in `public/`).
- **Language**: English only, but keep URLs and layouts free of a language segment so that `/ja/` can be added later.
- **Client JavaScript**: none. Dark mode follows `prefers-color-scheme` only; there is no toggle and no client state.
- **Syntax highlighting**: Astro's built-in Shiki with `github-dark-default` in both colour schemes (code blocks are always dark). Languages in use are `dart`, `bash` and `ts`. Do not add highlighting packages.
- **Styling**: CSS Modules + CSS custom properties. No Tailwind and no Astro scoped `<style>`.
  - `src/styles/tokens.css`: design tokens.
  - `src/styles/global.css`: base fixes, body typography, links and focus. Loaded on every page, so nothing page-specific goes here.
  - `src/features/posts/components/Prose.module.css`: Markdown body, loaded on post pages only.
  - Component-specific styles: one `*.module.css` per component, next to it.
  - Only tokens defined in `docs/design.md` exist; do not invent token names.
- **Package manager**: pnpm 12, pinned exactly in `packageManager`. Do not change `minimumReleaseAge` (pnpm's default refuses versions published less than 24 hours ago); a freshly published version not being installable is expected, not a bug. Build-script approvals are recorded in `pnpm-workspace.yaml` (`allowBuilds`).
- `sharp` is a direct dependency because Astro's image service cannot resolve it through pnpm's isolated `node_modules` otherwise.

## Design rule

`docs/design.md` records the current design and the reason for each decision. It is a record, not a constraint: when the design changes, change the document with it. Use the tokens and spacing scale in `tokens.css` rather than one-off values.

## Content

- Posts: `src/content/posts/<slug>/index.md`; the directory name is the slug. Images live in the same directory.
- Schema: `src/content.config.ts`. `draft: true` posts appear in `pnpm dev` only. Always read posts through `getPosts()` in `src/features/posts/data/posts.ts` so drafts are filtered and posts are sorted newest first.
- `src/content/posts/sample-post/` is a draft that exercises every styled element. Use it to check layout changes.
- OGP: `heroImage` if set, otherwise `public/og.png`. No dynamic OGP generation.

## Commands

```bash
pnpm dev            # dev server; use `astro dev --background` for a background server,
                    # managed with `astro dev stop|status|logs`
pnpm astro check    # type check (CI runs this)
pnpm build          # static build into dist/ (CI runs this)
pnpm preview        # serve dist/
```

CI (`.github/workflows/ci.yml`) installs dependencies through `pnpm/setup` and runs `pnpm astro check` and `pnpm build` on every pull request.

## Quality bar

- No layout breakage from 320px wide.
- Keyboard focus is always visible.
- Body text, secondary text, links and code comments meet WCAG AA contrast.
- Pages look complete with no JavaScript.
- Lighthouse Performance, Accessibility and SEO are 95 or above.

## Out of scope for now

Migrating existing Medium posts, automatic cross-posting to dev.to, dynamic OGP images, full-text search, and the Japanese edition (`/ja/`). When cross-posting to dev.to, point its `canonical_url` at this site.
