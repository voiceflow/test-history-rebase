import { AIModel } from '@voiceflow/dtos';

import { modelFactory } from './ai-model.util';

export const GEMINI_PRO_MODEL_CONFIG = modelFactory({
  type: AIModel.GEMINI_PRO,
  name: 'Gemini Pro (coming soon)',
  info: '',
  icon: 'OpenAi',
  disabled: true,
});

export const GOOGLE_MODEL_CONFIGS = [GEMINI_PRO_MODEL_CONFIG];
