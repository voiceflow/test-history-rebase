import { Utils } from '@voiceflow/common';
import type { AIModel } from '@voiceflow/dtos';

import type { AIModelConfig } from './ai-model.interface';
import { ANTHROPIC_MODEL_CONFIGS } from './anthropic-model.config';
import { GOOGLE_MODEL_CONFIGS } from './google-model.config';
import { OPEN_AI_MODEL_CONFIGS } from './open-ai-model.config';

export const AI_MODEL_CONFIG_MAP = Utils.array.createMap<AIModelConfig, AIModel>(
  [...OPEN_AI_MODEL_CONFIGS, ...ANTHROPIC_MODEL_CONFIGS, ...GOOGLE_MODEL_CONFIGS],
  (model) => model.type
);
