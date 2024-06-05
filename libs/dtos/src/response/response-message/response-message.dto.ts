import { z } from 'zod';

import { CMSObjectResourceDTO, MarkupDTO } from '@/common';
import { AnyConditionCreateDTO } from '@/condition/condition-create.dto';

export const ResponseMessageDTO = CMSObjectResourceDTO.partial({
  updatedAt: true,
  updatedByID: true,
})
  .extend({
    assistantID: z.string().optional(),
    environmentID: z.string().optional(),
    discriminatorID: z.string(),

    text: MarkupDTO,
    delay: z.number().nullable(),
    condition: z.nullable(AnyConditionCreateDTO),
  })
  .strict();
