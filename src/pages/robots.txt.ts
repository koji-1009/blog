import type { APIRoute } from 'astro';

// Generated rather than placed in public/ so that the site URL stays in astro.config.mjs only.
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site);
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`);
};
