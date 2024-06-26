import { AIModel } from '@voiceflow/dtos';

import { modelFactory } from './ai-model.util';

export const GPT4_MODE_CONFIG = modelFactory({
  type: AIModel.GPT_4,
  name: 'GPT-4',
  info: '25 x tokens',
  icon: 'OpenAi',
  advanced: true,
});

export const GPT4_TURBO_MODE_CONFIG = modelFactory({
  type: AIModel.GPT_4_TURBO,
  name: 'GPT-4 Turbo',
  info: '12 x tokens',
  icon: 'OpenAi',
  advanced: true,
});

export const GPT4O_MODEL_CONFIG = modelFactory({
  type: AIModel.GPT_4O,
  name: 'GPT-4o',
  info: '6 x tokens',
  icon: 'OpenAi',
  advanced: true,
});

export const GPT3_5_TURBO_MODEL_CONFIG = modelFactory({
  type: AIModel.GPT_3_5_TURBO,
  name: 'GPT-3.5 Turbo',
  info: '0.6 x tokens',
  icon: 'OpenAi',
});

export const OPEN_AI_MODEL_CONFIGS = [
  GPT3_5_TURBO_MODEL_CONFIG,
  GPT4_TURBO_MODE_CONFIG,
  GPT4_MODE_CONFIG,
  GPT4O_MODEL_CONFIG,
];
