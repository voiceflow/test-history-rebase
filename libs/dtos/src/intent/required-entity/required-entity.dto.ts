import { z } from 'zod';

import { CMSCreatableResourceDTO } from '@/common';

export const RequiredEntityDTO = CMSCreatableResourceDTO.extend({
  intentID: z.string(),
  entityID: z.string(),
  repromptID: z.string().nullable(),
  assistantID: z.string(),
  environmentID: z.string(),
});

export type RequiredEntity = z.infer<typeof RequiredEntityDTO>;
