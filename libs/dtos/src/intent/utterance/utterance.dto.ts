import { z } from 'zod';

import { CMSObjectResourceDTO, Language } from '@/common';

import { UtteranceTextDTO } from './utterance-text.dto';

export const UtteranceDTO = CMSObjectResourceDTO.partial({
  updatedAt: true,
  updatedByID: true,
}).extend({
  text: UtteranceTextDTO,
  language: z.nativeEnum(Language),
  intentID: z.string(),
  assistantID: z.string().optional(),
  environmentID: z.string().optional(),
});

export type Utterance = z.infer<typeof UtteranceDTO>;
