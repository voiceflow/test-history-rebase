import { Utils } from '@voiceflow/common';
import { AIModel } from '@voiceflow/dtos';

import { AIModelConfig } from './ai-model.interface';
import { ANTHROPIC_MODEL_CONFIGS } from './anthropic-model.config';
import { GOOGLE_MODEL_CONFIGS } from './google-model.config';
import { GROQ_MODEL_CONFIGS } from './groq-model.config';
import { OPEN_AI_MODEL_CONFIGS } from './open-ai-model.config';

export const AI_MODEL_CONFIG_MAP = Utils.array.createMap<AIModelConfig, AIModel>(
  [...OPEN_AI_MODEL_CONFIGS, ...ANTHROPIC_MODEL_CONFIGS, ...GOOGLE_MODEL_CONFIGS, ...GROQ_MODEL_CONFIGS],
  (model) => model.type
);
