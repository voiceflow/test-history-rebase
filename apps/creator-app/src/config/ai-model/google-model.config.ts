import { AIGPTModel } from '@voiceflow/dtos';

import { modelFactory } from './ai-model.util';

export const GEMINI_PRO_MODE_CONFIG = modelFactory({
  type: AIGPTModel.GEMINI_PRO,
  name: 'Gemini Pro (coming soon)',
  info: '',
  icon: 'OpenAi',
  disabled: true,
});

export const GOOGLE_MODEL_CONFIGS = [GEMINI_PRO_MODE_CONFIG];
