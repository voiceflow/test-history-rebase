import { z } from 'zod';

export const KBDocumentChunkDTO = z.object({
  chunkID: z.string(),
  content: z.string(),
  metadata: z.record(z.any()).optional(),
});

export type KBDocumentChunk = z.infer<typeof KBDocumentChunkDTO>;
