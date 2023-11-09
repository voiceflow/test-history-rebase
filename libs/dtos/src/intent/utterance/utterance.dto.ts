import { z } from 'zod';

import { CMSObjectResourceDTO, Language } from '@/common';

import { UtteranceTextDTO } from './utterance-text.dto';

export const UtteranceDTO = CMSObjectResourceDTO.extend({
  text: UtteranceTextDTO,
  language: z.nativeEnum(Language),
  intentID: z.string(),
  assistantID: z.string(),
  environmentID: z.string(),
});

export type Utterance = z.infer<typeof UtteranceDTO>;
