import { z } from 'zod';

import { ReferenceResourceMetadata, ReferenceResourceMetadataDTO } from './reference-resource-metadata.dto';
import { ReferenceResourceType } from './reference-resource-type.enum';

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

export type ReferenceResource<Metadata extends ReferenceResourceMetadata | null = ReferenceResourceMetadata | null> =
  Omit<z.infer<typeof ReferenceResourceDTO>, 'metadata'> & { metadata: Metadata };
