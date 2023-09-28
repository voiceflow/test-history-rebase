import { z } from 'nestjs-zod/z';

import { BaseResource } from './base-resource.dto';

export const ObjectResource = BaseResource.extend({
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
});

export const ObjectResourceInternal = BaseResource.extend({
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});
