import { z } from 'zod';

import { CMSObjectResourceDTO } from '@/common';

export const RequiredEntityDTO = CMSObjectResourceDTO.partial({
  updatedAt: true,
  updatedByID: true,
}).extend({
  intentID: z.string(),
  entityID: z.string(),
  repromptID: z.string().nullable(),
  assistantID: z.string().optional(),
  environmentID: z.string().optional(),
});

export type RequiredEntity = z.infer<typeof RequiredEntityDTO>;
