import { z } from 'zod';

import { CMSTabularResourceDTO } from '@/common';
import { VariableNameDTO } from '@/variable/variable-name.dto';

export const EntityDTO = CMSTabularResourceDTO.extend({
  name: VariableNameDTO,
  color: z.string(),
  isArray: z.boolean(),
  classifier: z.string().nullable(),
  description: z.string().nullable(),
}).strict();

export type Entity = z.infer<typeof EntityDTO>;
