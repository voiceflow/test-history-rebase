import { z } from 'zod';

export const KBDocumentInsertChunkDTO = z.object({
  id: z.string(),
  metadata: z.object({
    content: z.string(),
    prev: z.string().optional().nullable(),
    next: z.string().optional().nullable(),
    position: z.number().optional(),
    tags: z.array(z.string()).optional().nullable(),
    metadata: z.record(z.any()).optional(),
  }),
  embedding: z.array(z.number()),
});

export type KBDocumentInsertChunk = z.infer<typeof KBDocumentInsertChunkDTO>;
