import { IntentDTO } from '@voiceflow/dtos';
import { z } from 'zod';

import { IntentExportDataDTO } from './intent-export-data.dto';

export const IntentImportDataDTO = IntentExportDataDTO.extend({
  intents: z.array(
    IntentDTO.extend({
      automaticRepromptSettings: IntentDTO.shape.automaticRepromptSettings.optional().default(null),
    })
  ),
}).strict();

export type IntentImportDataDTO = z.infer<typeof IntentImportDataDTO>;
