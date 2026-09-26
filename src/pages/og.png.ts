import type { APIRoute } from 'astro';
import { renderOgImage } from '../features/og/data/ogImage';
import { SITE_DESCRIPTION } from '../shared/lib/site';

// The image for every page that is not a post. Generated rather than placed in public/ so that it
// shares its layout, colours and byline with the post images.
export const GET: APIRoute = async ({ site }) => {
  const png = await renderOgImage({ kind: 'site', statement: SITE_DESCRIPTION, host: site!.host });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
