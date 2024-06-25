import { AIModel } from '@voiceflow/dtos';

import { modelFactory } from './ai-model.util';

export const GEMINI_PRO_1_5_MODEL_CONFIG = modelFactory({
  type: AIModel.GEMINI_PRO_1_5,
  name: 'Gemini Pro 1.5',
  info: '8x tokens',
  icon: 'Google',
  advanced: true,
});

export const GOOGLE_MODEL_CONFIGS = [GEMINI_PRO_1_5_MODEL_CONFIG];
