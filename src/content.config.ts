import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import type { Loader } from 'astro/loaders';
import { z } from 'astro/zod';

// Each post lives in its own directory, so the entry id (and the URL slug) is the directory name.
const postFiles = glob({
  base: './src/content/posts',
  pattern: '*/index.md',
  generateId: ({ entry }) => entry.split('/')[0],
});

// Outside dev (where there is no file watcher), drafts are removed from the store, so that
// their images are not bundled into the build either.
const postLoader: Loader = {
  name: 'posts',
  load: async (context) => {
    await postFiles.load(context);
    if (context.watcher) return;
    for (const [id, entry] of context.store.entries()) {
      if (entry.data.draft) context.store.delete(id);
    }
  },
};

const posts = defineCollection({
  loader: postLoader,
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      heroImage: image().optional(),
    }),
});

export const collections = { posts };
