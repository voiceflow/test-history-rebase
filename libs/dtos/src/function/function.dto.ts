import { z } from 'zod';

import { CMSTabularResourceDTO } from '@/common';

export const FunctionDTO = CMSTabularResourceDTO.extend({
  code: z.string(),
  image: z.string().nullable(),
  description: z.string().nullable(),
  pathOrder: z.array(z.string()).optional(),
}).strict();

export type Function = z.infer<typeof FunctionDTO>;
