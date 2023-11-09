import { z } from 'zod';

import { CMSObjectResourceDTO, MarkupDTO } from '@/common';

export const CardButtonDTO = CMSObjectResourceDTO.extend({
  label: MarkupDTO,
  cardID: z.string(),
  assistantID: z.string(),
  environmentID: z.string(),
}).strict();

export type CardButton = z.infer<typeof CardButtonDTO>;
