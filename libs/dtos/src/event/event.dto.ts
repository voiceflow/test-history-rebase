import { z } from 'zod';

import { CMSTabularResourceDTO } from '@/common';

export const EventDTO = CMSTabularResourceDTO.extend({
  requestName: z.string(),
  description: z.string().nullable(),
}).strict();

export type Event = z.infer<typeof EventDTO>;
