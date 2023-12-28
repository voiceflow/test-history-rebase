import { z } from 'zod';

import { IntentDTO } from './intent.dto';
import { RequiredEntityDTO } from './required-entity/required-entity.dto';
import { UtteranceDTO } from './utterance/utterance.dto';

export const IntentWithDataDTO = IntentDTO.extend({
  utterances: z.array(UtteranceDTO),
  requiredEntities: z.array(RequiredEntityDTO),
}).strict();

export type IntentWithData = z.infer<typeof IntentWithDataDTO>;
