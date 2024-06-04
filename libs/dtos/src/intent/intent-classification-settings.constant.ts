import { DEFAULT_INTENT_CLASSIFICATION_PROMPT_WRAPPER_CODE } from '@voiceflow/default-prompt-wrappers';

import { DEFAULT_AI_MODEL } from '@/ai/ai-model.constant';
import type { AIPromptWrapper } from '@/ai/ai-prompt-wrapper.dto';

import type {
  IntentClassificationLLMSettings,
  IntentClassificationNLUSettings,
} from './intent-classification-settings.dto';
import { IntentClassificationType } from './intent-classification-type.enum';

export const DEFAULT_INTENT_CLASSIFICATION_LLM_PROMPT_WRAPPER: AIPromptWrapper = {
  content: DEFAULT_INTENT_CLASSIFICATION_PROMPT_WRAPPER_CODE,
};

export const DEFAULT_INTENT_CLASSIFICATION_LLM_SETTINGS: IntentClassificationLLMSettings = {
  type: IntentClassificationType.LLM,
  params: {
    model: DEFAULT_AI_MODEL,
    temperature: 0.1,
  },
  promptWrapper: null,
};

export const DEFAULT_INTENT_CLASSIFICATION_NLU_SETTINGS: IntentClassificationNLUSettings = {
  type: IntentClassificationType.NLU,
  params: {
    confidence: 0.6,
  },
};
