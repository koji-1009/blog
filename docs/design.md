# Design

The visual specification of this site and the reasons behind it. Tokens live in `src/styles/tokens.css`. When the design changes, update this document with the reason.

## Audience and character

- Readers: Flutter and Dart developers outside Japan who arrive at a single post from pub.dev, a GitHub README, X, r/FlutterDev and similar links.
- Role: make long technical posts with Dart, bash and TypeScript code and images (such as PNG diffs of UI) comfortable to read.
- Character: a developer's personal blog and ongoing work log. It should look deliberate and current, in the same family as other well-known personal developer blogs, without decoration that carries no information.

## Motif: the commit graph

Posts are joined by a vertical rail with a node per post, like `git log --graph`. The list really is chronological, and the shape is one readers see every day. Years sit on the rail as labels, like git tags.

The node (an accent-coloured circle with a soft ring) is the site's mark. It appears before the site name, on the rail, in the favicon and in the default OGP image, so every surface is recognizably the same site.

## Implementation

- CSS Modules + CSS custom properties, following the [sieve](https://github.com/koji-1009/crumple-zone-architecture/blob/main/skill/sieve.md) decision flow. No Tailwind, no Astro scoped `<style>`, no client JavaScript.
- `src/styles/tokens.css`: tokens. `src/styles/global.css`: base fixes, body typography, links and focus (loaded on every page).
- `src/features/posts/components/Prose.module.css`: the Markdown body, loaded on post pages only.
- One `*.module.css` per component, next to it. Pages use an `_`-prefixed module (`_index.module.css`).
- Dark mode is a token switch under `prefers-color-scheme`. Components never know which scheme is active.

## Colour

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--color-surface` | `#ffffff` | `#111318` | Page background |
| `--color-foreground` | `#1c2128` | `#e6e8eb` | Body text, titles |
| `--color-foreground-muted` | `#59626e` | `#9aa3ae` | Dates, descriptions, navigation, footer |
| `--color-accent` | `#0b62c4` | `#79b0ff` | Links, nodes, focus, quote bar |
| `--color-accent-soft` | `#eef3fb` | `#1a2433` | Tag pills, the ring around the site mark |
| `--color-tint` | `#f3f5f7` | `#1d2129` | Inline code, year labels, table headers, quotes |
| `--color-rule` | `#e4e7eb` | `#272b33` | Dividing lines, image borders |
| `--color-rail` | `#cfd5dd` | `#3a414b` | The rail in the post list |
| `--color-code-surface` | `#0d1117` | `#0d1117` | Code blocks |

- Contrast (WCAG): body text 16.2 : 1 / 15.1 : 1 (light / dark); muted 6.2 : 1 / 7.3 : 1, and 5.7 : 1 / 6.3 : 1 on the tint; accent 5.9 : 1 / 8.4 : 1, and 5.3 : 1 / 7.0 : 1 on the soft accent. All meet AA.
- Code blocks use Shiki's `github-dark-default` in both schemes. On a white page a dark block is the strongest possible signal that "this is code", which matters in code-heavy posts, and its comment colour (`#8b949e`) keeps 6.2 : 1 against `#0d1117`. In dark mode the block gets a 1px `--color-rule` border (`--color-code-border`) so it stays separate from the dark page.

## Typefaces

```css
--font-sans: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
--font-mono: ui-monospace, "SF Mono", SFMono-Regular, Menlo, "Cascadia Code", Consolas, "Liberation Mono", monospace;
```

- The operating system's UI sans-serif for everything but code. It is the font readers see on GitHub and in their OS, reads cleanly on screens, and needs no web font: no external request and no font swap on first paint.
- Headings are bold with slightly negative letter spacing, which keeps large sans-serif type tight.

## Sizes

| Token | Size | Use |
| --- | --- | --- |
| `--text-xs` | 13px | Code language label |
| `--text-sm` | 14px | Dates, navigation, footer, tags, year labels, image captions |
| `--text-code` | 15px | Code blocks |
| `--text-base` | 18px | Body text |
| `--text-lg` | 20px | Post titles in the list, post description |
| `--text-h3` / `--text-h2` | 20px / 24px | Headings in posts |
| `--text-h1` | 32–44px (fluid) | Post title, tag name |
| `--text-lead` | 22–28px (fluid) | The sentence on the home page |

- Body 18px with 1.7 leading for long reading on screens; headings 1.25.
- The two fluid sizes use `clamp()` so large type shrinks smoothly on phones without a breakpoint.
- Inline code is 0.875em of the surrounding text, so it looks the same size as the text next to it.

## Spacing and layout

- Spacing scale: 4, 8, 16, 24, 40, 64px (`--space-xs` to `--space-2xl`). Every gap uses one of these.
- Column: `--measure: 42rem` (672px) plus `--gutter: 1.25rem` on each side, centred. Everything in a post, including code blocks and images, uses this width, so every edge lines up. It is set in `rem` rather than `ch` so that elements with a smaller font keep the same width.
- About 69 columns of code fit at the full width (622px of content at 15px, with a monospace advance of 0.6em); longer lines scroll horizontally.
- Radii: 4px for inline code, 8px for code blocks, images and quotes, fully round for pills.
- There are no layout breakpoints: the header and footer wrap, and type scales with `clamp()`.

## Header and footer

- Header: the site mark and "Koji Wakamiya" (18px, bold) on the left, linking to the home page, which is the post list; "About", "RSS" and "日本語" (14px, muted, accent on hover) on the right. There is no separate "Posts" link, because it would point to the same page as the site name. "日本語" links to `https://blog.dr1009.com/` with `lang="ja"` and `hreflang="ja"`. Not fixed.
- Footer: a rule, then "© Koji Wakamiya. Code samples: MIT" on the left and GitHub, X, Zenn, RSS and the Japanese blog on the right, all 14px muted.

## Home page

- The sentence about the author at `--text-lead`, semibold, as the page's opening statement.
- Below it, the byline (`src/components/Byline.astro`): the GitHub avatar (64px, round) beside two lines, "Koji Wakamiya (koji-1009)" in semibold with the handle linking to GitHub, and "Flutter framework contributor and pub.dev package maintainer. More about me →" in muted text. Readers arriving from pub.dev or GitHub judge a post partly by who wrote it, and the avatar is the same face they see there. Counts such as merged pull requests or packages go stale, so they live on the About page, not in the byline.
- The avatar is a copy of the GitHub avatar in `src/assets/`, served through Astro's image pipeline, so the page makes no request to GitHub.
- A small uppercase "Posts" heading (the page's `h1`), then the post list.

## About page

- `src/pages/about.md`, rendered with `src/layouts/Page.astro`: the post page's header (title and description as a subtitle) and the same `.prose` body, so it can be edited as Markdown.
- Content: contributions to Flutter grouped by area with links to the pull requests (including the unmerged iOS font fallback work), own open-source packages, and profiles elsewhere.

## Post list

- Rail: 2px `--color-rail`, unbroken across years.
- Year label: a pill in `--color-tint` placed over the rail, 14px semibold muted.
- Each post: date (14px muted), title (20px bold, accent on hover), description (16px muted).
- Node: a 12px accent circle centred on the rail and on the date line, with a 3px ring in the page colour so the rail appears to pass behind it. On hover or keyboard focus of the title, an accent ring appears around the node.
- Semantics: each year is a `<section>` with an `<h2>` and an `<ol>`; titles are `<h3>`. The rail and nodes are pseudo-elements.
- Tag pages reuse the list under a header: a small "Tag" label, the tag as the `h1` (`#flutter`), and the post count.

## Post page

- Header: date (and "· Updated …" if set), the title, the description as a subtitle (20px muted, as on Medium where the posts come from), and the tags as pills. A rule separates the header from the body.
- "← All posts" after the article.

## Post body (`.prose`)

- Paragraph gap 1.25em. h2 has 64px above it and h3 40px; both have 8px below, because a heading belongs to what follows it. Code blocks, images and tables have 24px around them.
- Links: accent with a 1px underline at 40% opacity, full opacity on hover, so links are visible without striping the text.
- Inline code: `--color-tint` background, 4px radius.
- Code blocks: dark surface, 8px radius, 16px × 24px padding, 15px text with 1.6 leading. The language (from Shiki's `data-language`) is shown above the code as a small uppercase label, drawn with CSS only.
- Images: centred, 1px `--color-rule` border (so white screenshots do not merge into the page) and 8px radius.
- Image captions: a paragraph of only italic text (`*…*`) right after an image is its caption, 14px muted and centred, 8px below the image. Markdown has no caption syntax, and this keeps the image going through Astro's image optimization, which raw `<figure>` HTML would not.
- Before-and-after pairs: in a `.mdx` post, the `Compare` component (`src/features/posts/components/Compare.astro`) shows the two images side by side, each captioned "before" and "after" like an image caption, so the eye can move between them instead of scrolling. The columns are a grid of `auto-fit` tracks at least 16rem wide, so they stack on narrow screens without a breakpoint. Both images are aligned to the top, so a change in height shows at the bottom edge. The images are imported and passed through `<Image />`, so they are optimized like Markdown images.
- Link cards: in a `.mdx` post, the `LinkCard` component (`src/features/posts/components/LinkCard.astro`) shows a link to a package or repository as a card: the title (semibold, accent on hover), the description (14px muted, both clamped to two lines) and the host (14px muted) on the left, and the page's Open Graph image on the right at up to 12rem or 35% of the card. The card has a 1px `--color-rule` border and 8px radius, the same frame as images, and its border turns accent on hover. The whole card is one link, so the title is its accessible name and the image has empty alt text. Readers coming from pub.dev and GitHub recognise those pages' own preview images, which a bare URL does not give them. GitHub's title ("GitHub - owner/repo: description") repeats the description, so the card shows `owner/repo` instead. A card whose image could not be fetched takes the full row for text; a page that could not be fetched is a plain link.
- Quotes: `--color-tint` background with a 3px accent bar on the left; text stays in the body colour because quoted release notes and documentation are meant to be read.
- Tables: header row on `--color-tint`, a rule under every row, no vertical lines. A table wider than the column scrolls horizontally.
- Lists: 1.5em indent, 4px between items, muted markers.
- Headings get an `id` for linking, with no visible anchor symbol.

## Interaction

- Focus: 2px accent outline with 2px offset on `:focus-visible`, everywhere.
- Hover changes colour or underline only. No transitions and no animation.

## Default OGP image and favicon

- `public/og.png` (1200 × 630): the rail and one node on the left, "Koji Wakamiya" in bold sans-serif and the site description beside it, in the light palette.
- `public/favicon.svg`: the rail and a node, switching colours with `prefers-color-scheme`.

## Quality bar

- No breakage from 320px wide.
- Keyboard focus is always visible.
- Text, secondary text, links and code comments meet WCAG AA.
- The look is complete with no JavaScript.
