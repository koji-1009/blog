# blog

Source of [blog.koji-1009.com](https://blog.koji-1009.com), an English blog about Flutter: the framework, the packages around it, and the apps built on it. Built with [Astro](https://astro.build) as a fully static site and served by Cloudflare Workers static assets.

## Writing a post

### Files

Create a directory under `src/content/posts/`. Its name becomes the URL: `src/content/posts/my-post/` is published at `/posts/my-post/`. Write the post as `index.md` in that directory, or as `index.mdx` if it uses a component (see below). Images go in the same directory.

### Frontmatter

```yaml
---
title: Before-and-After Images for Flutter UI Changes
description: One or two sentences shown in the post list, meta description and OGP.
pubDate: 2026-09-23
updatedDate: 2026-10-01 # optional
tags: [flutter, testing] # optional
draft: true # optional; drafts appear in `pnpm dev` only
heroImage: ./hero.png # optional; used as the OGP image, otherwise public/og.png
---
```

### Body

- Headings start at `##`; the title is the page's only `#`.
- Images: `![Alt text](./diff.png)`, with a relative path. They are optimized at build time. Describe what the image shows in the alt text.
- Captions: a paragraph of only italic text right after an image, such as `*The diff: changed pixels in red.*`, is shown as its caption.
- Code blocks are highlighted by Shiki. Name the language: `dart`, `bash`, `ts` and `yaml` are in use so far, and any language Shiki bundles works.

### Components (`.mdx` only)

Import components after the frontmatter. The paths are relative to the post's directory:

```mdx
import Compare from '../../../features/posts/components/Compare.astro';
import LinkCard from '../../../features/posts/components/LinkCard.astro';
import before from './before.png';
import after from './after.png';
```

- `<Compare before={before} beforeAlt="…" after={after} afterAlt="…" />` shows a before-and-after pair side by side, captioned "before" and "after", and stacks them on narrow screens.
- `<LinkCard url="https://pub.dev/packages/shutter" />` shows a link to a package or repository as a card, with the page's title, description and Open Graph image read at build time. Put it on a line of its own. If the page cannot be fetched, the card falls back to a plain link and the build continues; if only the image cannot be fetched, the card has text only. Use it for pages with Open Graph tags (GitHub, pub.dev); for other pages, write an ordinary link.

MDX reads `<` and `{` as JSX outside code: write links as `[text](url)` (`<https://…>` is a build error), and put `<` and `{` in prose inside backticks.

## Local development

Requires Node.js 24 or later and pnpm (the version is pinned in `package.json` under `packageManager`).

```bash
pnpm install
pnpm dev          # http://localhost:4321, drafts included
pnpm astro check  # type check
pnpm build        # output in dist/, drafts excluded
pnpm preview      # serve dist/
```

## Deployment

The site deploys with Workers Builds (Cloudflare's Git integration). One-time setup in the Cloudflare dashboard:

1. **Workers & Pages** → **Create application** → **Import a repository** (**Get started**), choose the Git account and select `koji-1009/blog`.
2. Set the build settings, then **Save and Deploy**:
   - Build command: `pnpm build`
   - Deploy command: `pnpm wrangler deploy`
   - Production branch: `main`
3. Under **Settings** → **Build** → **Build Variables and Secrets**, add `PNPM_VERSION` with the same version as `packageManager` in `package.json` (currently `12.6.0`). The Workers Builds image defaults to an older pnpm, and its documentation does not say that it reads `packageManager`. Update this variable whenever `packageManager` changes.
4. Under **Settings** → **Domains & Routes** → **Add** → **Custom Domain**, enter `blog.koji-1009.com` and select **Add Custom Domain**. The `koji-1009.com` zone must be one you own in Cloudflare, and `blog.koji-1009.com` must not already have a CNAME record.

After that, every push to `main` builds and deploys the site. The Worker name (`blog`) and asset settings are in `wrangler.jsonc`. The site URL is set only in `astro.config.mjs` (`site`).

## License

See [LICENSE](LICENSE). Articles under `src/content/` are © Koji Wakamiya, all rights reserved. Code samples in articles and the site source code are under the MIT License.
