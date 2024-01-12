import { AIGPTModel } from '@voiceflow/dtos';

import { modelFactory } from './ai-model.util';

export const CLAUDE_V1_MODEL_CONFIG = modelFactory({
  type: AIGPTModel.CLAUDE_V1,
  name: 'Claude 1',
  info: '10 x tokens',
  icon: 'Anthropic',
});

export const CLAUDE_V2_MODEL_CONFIG = modelFactory({
  type: AIGPTModel.CLAUDE_V2,
  name: 'Claude 2',
  info: '10 x tokens',
  icon: 'Anthropic',
});

export const CLAUDE_INSTANT_V1_MODEL_CONFIG = modelFactory({
  type: AIGPTModel.CLAUDE_INSTANT_V1,
  name: 'Claude Instant 1.2',
  info: '1 x tokens',
  icon: 'Anthropic',
});

export const ANTHROPIC_MODEL_CONFIGS = [CLAUDE_INSTANT_V1_MODEL_CONFIG, CLAUDE_V1_MODEL_CONFIG, CLAUDE_V2_MODEL_CONFIG];
