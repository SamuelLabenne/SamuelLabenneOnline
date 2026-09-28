import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const insights = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/insights' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    author: z.string().default('Sam Labenne'),
    category: z.string().default('News'),
    // Cover style 0–3 (mint, lime, green, sun). Picked from the slug when omitted.
    cover: z.number().int().min(0).max(3).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { insights };
