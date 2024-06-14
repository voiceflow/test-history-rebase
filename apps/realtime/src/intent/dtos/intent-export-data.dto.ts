import { IntentDTO, RequiredEntityDTO, UtteranceDTO } from '@voiceflow/dtos';
import { z } from 'zod';

export const IntentExportDataDTO = z
  .object({
    intents: IntentDTO.array(),
    utterances: UtteranceDTO.array(),
    requiredEntities: RequiredEntityDTO.array(),
  })
  .strict();

export type IntentExportDataDTO = z.infer<typeof IntentExportDataDTO>;
