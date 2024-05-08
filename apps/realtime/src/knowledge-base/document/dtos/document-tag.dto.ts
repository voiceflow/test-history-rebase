import { z } from 'zod';

export const DocumentAttachTagsRequest = z.object({
  data: z.object({ tags: z.array(z.string()) }),
});

export type DocumentAttachTagsRequest = z.infer<typeof DocumentAttachTagsRequest>;
