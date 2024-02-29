import { z } from 'zod';

import { CMSTabularResourceDTO } from '@/common';

export const FlowDTO = CMSTabularResourceDTO.extend({
  name: z.string().min(1, 'Name is required.'),
  diagramID: z.string(),
  description: z.string().nullable(),
}).strict();

export type Flow = z.infer<typeof FlowDTO>;
