import { AI_MODEL_MAX_TOKENS_DEFAULT, AI_MODEL_MAX_TOKENS_HEAVY, HEAVY_AI_MODELS } from '@voiceflow/dtos';

import { CLOUD_ENV, PRIVATE_LLM_MODELS } from '@/config';

import { AIModelConfig } from './ai-model.interface';

export const modelFactory = <Config extends Omit<AIModelConfig, 'maxTokens'>>(config: Config) =>
  ({
    ...config,
    name: PRIVATE_LLM_MODELS.size ? `${CLOUD_ENV.toUpperCase()} ${config.name}` : config.name,
    hidden: !!PRIVATE_LLM_MODELS.size && !PRIVATE_LLM_MODELS.has(config.type),
    maxTokens: HEAVY_AI_MODELS.has(config.type) ? AI_MODEL_MAX_TOKENS_HEAVY : AI_MODEL_MAX_TOKENS_DEFAULT,
  } satisfies AIModelConfig);
