import { z } from 'nestjs-zod/z';

import { BaseResource } from './base-resource.dto';

export const RelationshipResource = BaseResource.extend({
  createdAt: z.string(),
  deletedAt: z.string().nullable(),
});

export const RelationshipResourceInternal = BaseResource.extend({
  createdAt: z.date(),
  deletedAt: z.date().nullable(),
});
