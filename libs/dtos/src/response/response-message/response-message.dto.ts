import { z } from 'zod';

import { CMSObjectResourceDTO, MarkupDTO } from '@/common';

export const ResponseMessageDTO = CMSObjectResourceDTO.partial({
  updatedAt: true,
  updatedByID: true,
})
  .extend({
    assistantID: z.string().optional(),
    environmentID: z.string().optional(),
    discriminatorID: z.string(),
    conditionID: z.string().nullable(),
    text: MarkupDTO,
    delay: z.number().nullable().optional(),
  })
  .strict();

export type ResponseMessage = z.infer<typeof ResponseMessageDTO>;
