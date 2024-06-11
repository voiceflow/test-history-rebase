import { z } from 'zod';

export const ReferenceIntentNodeMetadataDTO = z
  .object({
    isGlobal: z.boolean(),
  })
  .strict();

export type ReferenceIntentNodeMetadata = z.infer<typeof ReferenceIntentNodeMetadataDTO>;

// TODO: add union type for other metadata types
export const ReferenceMetadataDTO = ReferenceIntentNodeMetadataDTO;

export type ReferenceMetadata = z.infer<typeof ReferenceMetadataDTO>;
