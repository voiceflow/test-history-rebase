import type { z } from 'zod';

import { UtteranceDTO } from './utterance.dto';

export const UtteranceCreateDTO = UtteranceDTO.pick({ text: true, language: true }).strict();

export type UtteranceCreate = z.infer<typeof UtteranceCreateDTO>;
