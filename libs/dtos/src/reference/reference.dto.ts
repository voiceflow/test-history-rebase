import { z } from 'zod';

export const ReferenceMetadataDTO = z.record(z.unknown());

export type ReferenceMetadata = z.infer<typeof ReferenceMetadataDTO>;

export const ReferenceDTO = z
  .object({
    id: z.string(),
    metadata: z.nullable(ReferenceMetadataDTO),
    resourceID: z.string(),
    environmentID: z.string(),
    referrerResourceID: z.string(),
  })
  .strict();

export type Reference = z.infer<typeof ReferenceDTO>;
