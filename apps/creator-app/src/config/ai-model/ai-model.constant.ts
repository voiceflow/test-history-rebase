import { Utils } from '@voiceflow/common';
import { AIGPTModel } from '@voiceflow/dtos';

import { AIModelConfig } from './ai-model.interface';
import { ANTHROPIC_MODEL_CONFIGS } from './anthropic-model.config';
import { GOOGLE_MODEL_CONFIGS } from './google-model.config';
import { OPEN_AI_MODEL_CONFIGS } from './open-ai-model.config';

export const SYSTEM_PROMPT_AI_MODELS = new Set<AIGPTModel>([
  AIGPTModel.GPT_4,
  AIGPTModel.CLAUDE_V1,
  AIGPTModel.CLAUDE_V2,
  AIGPTModel.GPT_4_TURBO,
  AIGPTModel.GPT_3_5_TURBO,
  AIGPTModel.CLAUDE_INSTANT_V1,
]);

export const ADVANCED_AI_MODELS = new Set<AIGPTModel>([AIGPTModel.GPT_4, AIGPTModel.CLAUDE_V1, AIGPTModel.CLAUDE_V2, AIGPTModel.GPT_4_TURBO]);

export const AI_MODEL_CONFIG_MAP = Utils.array.createMap<AIModelConfig, AIGPTModel>(
  [...OPEN_AI_MODEL_CONFIGS, ...ANTHROPIC_MODEL_CONFIGS, ...GOOGLE_MODEL_CONFIGS],
  (model) => model.type
);
