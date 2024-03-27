import { z } from 'zod';

import { CMSTabularResourceDTO } from '@/common';

export const FlowDTO = CMSTabularResourceDTO.extend({
  name: CMSTabularResourceDTO.shape.name.min(1, 'Name is required.'),
  diagramID: z.string(),
  description: z.string().nullable(),
}).strict();

export type Flow = z.infer<typeof FlowDTO>;
