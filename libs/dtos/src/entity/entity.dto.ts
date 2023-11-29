import { z } from 'zod';

import { CMSTabularResourceDTO } from '@/common';
import { VariableDTO } from '@/variable/variable.dto';

export const EntityDTO = CMSTabularResourceDTO.extend({
  name: VariableDTO.shape.name,
  color: z.string(),
  isArray: z.boolean(),
  classifier: z.string().nullable(),
  description: z.string().nullable(),
}).strict();

export type Entity = z.infer<typeof EntityDTO>;
