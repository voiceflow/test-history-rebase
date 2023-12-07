import { z } from 'zod';

import { CMSObjectResourceDTO } from '@/common';

export const RequiredEntityDTO = CMSObjectResourceDTO.extend({
  intentID: z.string(),
  entityID: z.string(),
  repromptID: z.string().nullable(),
  assistantID: z.string(),
  environmentID: z.string(),
});

export type RequiredEntity = z.infer<typeof RequiredEntityDTO>;
