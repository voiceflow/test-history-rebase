import { z } from 'zod';

import { CMSTabularResourceDTO } from '@/common';

export const FlowDTO = CMSTabularResourceDTO.extend({
  diagramID: z.string(),
  description: z.string().nullable(),
}).strict();

export type Flow = z.infer<typeof FlowDTO>;
