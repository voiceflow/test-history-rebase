import { z } from 'zod';

import { CMSObjectResourceDTO, MarkupDTO } from '@/common';

export const CardButtonDTO = CMSObjectResourceDTO.partial({
  updatedAt: true,
  updatedByID: true,
})
  .extend({
    label: MarkupDTO,
    cardID: z.string(),
    assistantID: z.string().optional(),
    environmentID: z.string().optional(),
  })
  .strict();

export type CardButton = z.infer<typeof CardButtonDTO>;
