import { z } from 'zod';

export const KBDocumentChunkDTO = z.object({
  chunkID: z.string(),
  content: z.string(),
});

export type KBDocumentChunk = z.infer<typeof KBDocumentChunkDTO>;
