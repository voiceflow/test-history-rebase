import { AI_MODEL_PARAMS, AIModelParam } from '@voiceflow/dtos';

import { CLOUD_ENV, PRIVATE_LLM_MODELS } from '@/config';

import { AIModelConfig } from './ai-model.interface';

export const modelFactory = <Config extends Omit<AIModelConfig, keyof AIModelParam>>(config: Config) =>
  ({
    ...config,
    ...AI_MODEL_PARAMS[config.type],
    name: PRIVATE_LLM_MODELS.size ? `${CLOUD_ENV.toUpperCase()} ${config.name}` : config.name,
    hidden: !!PRIVATE_LLM_MODELS.size && !PRIVATE_LLM_MODELS.has(config.type),
  } satisfies AIModelConfig);
