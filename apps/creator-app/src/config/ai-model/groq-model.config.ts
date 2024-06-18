import { AIModel } from '@voiceflow/dtos';

import { modelFactory } from './ai-model.util';

export const GROQ_MIXTRAL_8X7B_32768_MODEL_CONFIG = modelFactory({
  type: AIModel.GROQ_MIXTRAL_8X7B_32768,
  name: 'groq mixtral-8x7B',
  info: '0.5 x tokens',
  icon: 'Anthropic',
  advanced: true,
});

export const GROQ_LLAMA3_70B_8192_MODEL_CONFIG = modelFactory({
  type: AIModel.GROQ_LLAMA3_70B_8192,
  name: 'groq llama3-70B',
  info: '0.5 x tokens',
  icon: 'Anthropic',
  advanced: true,
});

export const GROQ_MODEL_CONFIGS = [GROQ_MIXTRAL_8X7B_32768_MODEL_CONFIG, GROQ_LLAMA3_70B_8192_MODEL_CONFIG];
