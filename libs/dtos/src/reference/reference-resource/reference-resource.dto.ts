import { z } from 'zod';

import { ReferenceResourceType } from './reference-resource-type.enum';

export const ReferenceResourceMetadataDTO = z.record(z.unknown());

export type ReferenceResourceMetadata = z.infer<typeof ReferenceResourceMetadataDTO>;

export const ReferenceResourceDTO = z
  .object({
    id: z.string(),
    type: z.nativeEnum(ReferenceResourceType),
    metadata: z.nullable(ReferenceResourceMetadataDTO),
    diagramID: z.string().nullable(),
    resourceID: z.string(),
    assistantID: z.string(),
    environmentID: z.string(),
  })
  .strict();

export type ReferenceResource = z.infer<typeof ReferenceResourceDTO>;
