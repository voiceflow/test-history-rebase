import { z } from 'zod';

export const DocumentSitemapRequest = z.object({
  sitemapURL: z.string(),
});

export type DocumentSitemapRequest = z.infer<typeof DocumentSitemapRequest>;

export const DocumentSitemapResponse = z.array(z.string()).optional();

export type DocumentSitemapResponse = z.infer<typeof DocumentSitemapResponse>;
