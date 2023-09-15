import { z } from 'zod';

import { MetadataSchema } from '@/metadata/dtos/metadata.dto';

export const createFindOneResponseSchema = <ItemType extends z.ZodTypeAny>(ResourceSchema: ItemType) =>
  z
    .object({
      data: ResourceSchema,
    })
    .strict();

export const createFindOneWithMetadataResponseSchema = <ItemType extends z.ZodTypeAny>(ResourceSchema: ItemType) =>
  z
    .object({
      data: ResourceSchema,
      metadata: MetadataSchema,
    })
    .strict();
