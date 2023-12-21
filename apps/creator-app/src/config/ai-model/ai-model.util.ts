import { CLOUD_ENV, PRIVATE_LLM_MODELS } from '@/config';

import { AIModelConfig } from './ai-model.interface';

export const modelFactory = <Config extends AIModelConfig>(config: Config): AIModelConfig & Config => ({
  ...config,
  name: PRIVATE_LLM_MODELS.size ? `${CLOUD_ENV.toUpperCase()} ${config.name}` : config.name,
  hidden: !!PRIVATE_LLM_MODELS.size && !PRIVATE_LLM_MODELS.has(config.type),
});
