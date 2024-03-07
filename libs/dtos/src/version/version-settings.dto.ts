import { z } from 'zod';

import { IntentClassificationSettingsDTO } from '@/intent/intent-classification-settings.dto';

export const VersionSettingsDTO = z.object({
  intentClassification: IntentClassificationSettingsDTO,
});

export type VersionSettings = z.infer<typeof VersionSettingsDTO>;
