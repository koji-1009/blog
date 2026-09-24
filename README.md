# blog

Source of [blog.koji-1009.com](https://blog.koji-1009.com), an English blog about Flutter and Dart tools. Built with [Astro](https://astro.build) as a fully static site and served by Cloudflare Workers static assets.

## Adding a post

1. Create a directory under `src/content/posts/`. Its name becomes the URL: `src/content/posts/my-post/` is published at `/posts/my-post/`.
2. Write `index.md` in that directory with this frontmatter:

   ```yaml
   ---
   title: Before-and-After Images for Flutter UI Changes
   description: One or two sentences shown in the post list, meta description and OGP.
   pubDate: 2026-09-23
   updatedDate: 2026-10-01 # optional
   tags: [flutter, testing] # optional
   draft: true # optional; drafts appear in `pnpm dev` only
   heroImage: ./hero.png # optional; used as the OGP image
   ---
   ```

3. Put images in the same directory and reference them with a relative path, for example `![Alt text](./diff.png)`. They are optimized at build time.

Code blocks are highlighted by Shiki; use `dart`, `bash` or `ts` as the language.

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
