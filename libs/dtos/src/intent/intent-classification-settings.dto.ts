import { z } from 'zod';

import { AIParamsDTO } from '@/ai/ai-params.dto';
import { AIPromptWrapperDTO } from '@/ai/ai-prompt-wrapper.dto';
import { NLUParamsDTO } from '@/nlu/nlu-params.dto';

import { IntentClassificationType } from './intent-classification-type.enum';

export const IntentClassificationLLMSettingsDTO = z
  .object({
    type: z.literal(IntentClassificationType.LLM),
    params: AIParamsDTO.pick({ model: true, temperature: true }).required(),
    promptWrapper: z.nullable(AIPromptWrapperDTO),
  })
  .strict();

export type IntentClassificationLLMSettings = z.infer<typeof IntentClassificationLLMSettingsDTO>;

export const IntentClassificationNLUSettingsDTO = z
  .object({
    type: z.literal(IntentClassificationType.NLU),
    params: NLUParamsDTO.pick({ confidence: true }).required(),
  })
  .strict();

export type IntentClassificationNLUSettings = z.infer<typeof IntentClassificationNLUSettingsDTO>;

export const IntentClassificationSettingsDTO = z.discriminatedUnion('type', [
  IntentClassificationLLMSettingsDTO,
  IntentClassificationNLUSettingsDTO,
]);

export type IntentClassificationSettings = z.infer<typeof IntentClassificationSettingsDTO>;
