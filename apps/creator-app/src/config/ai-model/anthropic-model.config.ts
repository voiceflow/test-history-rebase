import { AIModel } from '@voiceflow/dtos';

import { modelFactory } from './ai-model.util';

export const CLAUDE_V1_MODEL_CONFIG = modelFactory({
  type: AIModel.CLAUDE_V1,
  name: 'Claude 1',
  info: '10 x tokens',
  icon: 'Anthropic',
  advanced: true,
});

export const CLAUDE_V2_MODEL_CONFIG = modelFactory({
  type: AIModel.CLAUDE_V2,
  name: 'Claude 2',
  info: '10 x tokens',
  icon: 'Anthropic',
  advanced: true,
});

export const CLAUDE_INSTANT_V1_MODEL_CONFIG = modelFactory({
  type: AIModel.CLAUDE_INSTANT_V1,
  name: 'Claude Instant 1.2',
  info: '1 x tokens',
  icon: 'Anthropic',
});

export const CLAUDE_3_HAIKU_MODEL_CONFIG = modelFactory({
  type: AIModel.CLAUDE_3_HAIKU,
  name: 'Claude 3 - Haiku',
  info: '0.5 x tokens',
  icon: 'Anthropic',
});

export const CLAUDE_3_SONNET_MODEL_CONFIG = modelFactory({
  type: AIModel.CLAUDE_3_SONNET,
  name: 'Claude 3 - Sonnet',
  info: '5 x tokens',
  icon: 'Anthropic',
  advanced: true,
});

export const CLAUDE_3_OPUS_MODEL_CONFIG = modelFactory({
  type: AIModel.CLAUDE_3_OPUS,
  name: 'Claude 3 - Opus',
  info: '20 x tokens',
  icon: 'Anthropic',
  advanced: true,
});

export const CLAUDE_3_5_SONNET_MODEL_CONFIG = modelFactory({
  type: AIModel.CLAUDE_3_5_SONNET,
  name: 'Claude 3.5 - Sonnet',
  info: '5 x tokens',
  icon: 'Anthropic',
  advanced: true,
});

export const ANTHROPIC_MODEL_CONFIGS = [
  CLAUDE_INSTANT_V1_MODEL_CONFIG,
  CLAUDE_V1_MODEL_CONFIG,
  CLAUDE_V2_MODEL_CONFIG,
  CLAUDE_3_HAIKU_MODEL_CONFIG,
  CLAUDE_3_SONNET_MODEL_CONFIG,
  CLAUDE_3_5_SONNET_MODEL_CONFIG,
  CLAUDE_3_OPUS_MODEL_CONFIG,
];
