import { z } from 'zod';

import { AIParamsDTO } from '@/ai/ai-params.dto';
import { AIPromptWrapperDTO } from '@/ai/ai-prompt-wrapper.dto';
import { CMSTabularResourceDTO } from '@/common';

export const IntentAutomaticRepromptSettingsDTO = z.object({
  params: z.nullable(
    AIParamsDTO.pick({ model: true, system: true, maxTokens: true, temperature: true }).strict().required()
  ),
  promptWrapper: z.nullable(AIPromptWrapperDTO),
});

export type IntentAutomaticRepromptSettings = z.infer<typeof IntentAutomaticRepromptSettingsDTO>;

export const IntentDTO = CMSTabularResourceDTO.extend({
  description: z.string().nullable(),
  entityOrder: z.array(z.string()),
  automaticReprompt: z.boolean(),
});

export type Intent = z.infer<typeof IntentDTO>;
