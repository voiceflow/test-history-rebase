import { z } from 'zod';

import { IntentDTO } from './intent.dto';
import { UtteranceDTO } from './utterance/utterance.dto';

export const IntentWithUtterancesDTO = IntentDTO.extend({
  utterances: z.array(UtteranceDTO),
}).strict();

export type IntentWithUtterances = z.infer<typeof IntentWithUtterancesDTO>;
