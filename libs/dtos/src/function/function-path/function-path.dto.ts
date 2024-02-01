import { z } from 'zod';

import { CMSObjectResourceDTO } from '@/common';

export const FunctionPathDTO = CMSObjectResourceDTO.partial({
  updatedAt: true,
  updatedByID: true,
})
  .extend({
    name: z.string().max(255),
    label: z.string().nullable(),
    functionID: z.string(),
    assistantID: z.string().optional(),
    environmentID: z.string().optional(),
  })
  .strict();

export type FunctionPath = z.infer<typeof FunctionPathDTO>;
