import { IntentDTO, RequiredEntityDTO, UtteranceDTO } from '@voiceflow/dtos';
import { z } from 'zod';

export const IntentExportImportDataDTO = z
  .object({
    intents: IntentDTO.array(),
    utterances: UtteranceDTO.array(),
    requiredEntities: RequiredEntityDTO.array(),
  })
  .strict();

export type IntentExportImportDataDTO = z.infer<typeof IntentExportImportDataDTO>;
