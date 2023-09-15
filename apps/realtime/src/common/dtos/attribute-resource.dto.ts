import { z } from 'nestjs-zod/z';

import { BaseResource } from './base-resource.dto';

export const AttributeResource = BaseResource.extend({
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});
