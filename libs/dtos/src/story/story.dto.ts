import { z } from 'zod';

import { CMSTabularResourceDTO } from '@/common';

import { StoryStatus } from './story-status.enum';

export const StoryDTO = CMSTabularResourceDTO.extend({
  status: z.nativeEnum(StoryStatus).nullable(),
  flowID: z.string().nullable(),
  isStart: z.boolean(),
  isEnabled: z.boolean(),
  assigneeID: z.number().nullable(),
  description: z.string().nullable(),
  triggerOrder: z.array(z.string()),
}).strict();

export type Story = z.infer<typeof StoryDTO>;
