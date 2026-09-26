import type { APIRoute, GetStaticPaths } from 'astro';
import { getPosts, type Post } from '../../../features/posts/data/posts';
import { renderOgImage } from '../../../features/og/data/ogImage';
import { formatDate } from '../../../shared/lib/dates';

export const getStaticPaths = (async () => {
  const posts = await getPosts();
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute<{ post: Post }> = async ({ props: { post }, site }) => {
  const png = await renderOgImage({
    kind: 'post',
    title: post.data.title,
    date: formatDate(post.data.pubDate),
    host: site!.host,
  });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
