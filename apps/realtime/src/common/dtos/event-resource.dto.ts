import { z } from 'nestjs-zod/z';

import { BaseResource } from './base-resource.dto';

export const EventResource = BaseResource.extend({
  createdAt: z.date(),
});
