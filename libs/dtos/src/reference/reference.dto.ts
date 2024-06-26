import { z } from 'zod';

import { ReferenceMetadataDTO } from './reference-metadata.dto';

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
