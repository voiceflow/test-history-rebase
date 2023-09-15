import { z } from 'zod';

import { createFindOneResponseSchema, createFindOneWithMetadataResponseSchema } from './find-one.dto';

export const createFindManyResponseSchema = <ItemType extends z.ZodTypeAny>(ResourceSchema: ItemType) =>
  z
    .object({
      items: createFindOneResponseSchema(ResourceSchema).array(),
    })
    .strict();

export const createFindManyWithMetadataResponseSchema = <ItemType extends z.ZodTypeAny>(ResourceSchema: ItemType) =>
  z
    .object({
      items: createFindOneWithMetadataResponseSchema(ResourceSchema).array(),
    })
    .strict();
