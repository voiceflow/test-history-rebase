import { z } from 'zod';

import { CMSTabularResourceDTO } from '@/common';

export const EntityDTO = CMSTabularResourceDTO.extend({
  color: z.string(),
  isArray: z.boolean(),
  classifier: z.string().nullable(),
  description: z.string().nullable(),
}).strict();

export type Entity = z.infer<typeof EntityDTO>;
