import { getOptionalProcessEnv, getRequiredProcessEnv, setupEnv } from '@voiceflow/backend-utils';

import { Config } from './types';

setupEnv();

const NODE_ENV = getRequiredProcessEnv('NODE_ENV');
const CLOUD_ENV = getOptionalProcessEnv('CLOUD_ENV', 'public');

const CONFIG: Config = {
  NODE_ENV,
  PORT: parseInt(getRequiredProcessEnv('PORT'), 10),

  // Deployment information
  CLOUD_ENV,
  IS_PRIVATE_CLOUD: NODE_ENV === 'production' && CLOUD_ENV !== 'public',
  CREATOR_API_ENDPOINT: getRequiredProcessEnv('CREATOR_API_ENDPOINT'),
  BILLING_API_ENDPOINT: getRequiredProcessEnv('BILLING_API_ENDPOINT'),
  AUTH_API_ENDPOINT: getRequiredProcessEnv('AUTH_API_ENDPOINT'),
  ANALYTICS_API_ENDPOINT: getRequiredProcessEnv('ANALYTICS_API_ENDPOINT'),
  IDENTITY_API_ENDPOINT: getRequiredProcessEnv('IDENTITY_API_ENDPOINT'),

  // Release information
  GIT_SHA: getOptionalProcessEnv('GIT_SHA'),
  BUILD_NUM: getOptionalProcessEnv('BUILD_NUM'),
  SEM_VER: getOptionalProcessEnv('SEM_VER'),
  BUILD_URL: getOptionalProcessEnv('BUILD_URL'),

  // Redis
  REDIS_CLUSTER_HOST: getRequiredProcessEnv('REDIS_CLUSTER_HOST'),
  REDIS_CLUSTER_PORT: parseInt(getRequiredProcessEnv('REDIS_CLUSTER_PORT'), 10),

  // Logux
  LOGUX_TIMEOUT: parseInt(getOptionalProcessEnv('LOGUX_TIMEOUT') || '40000', 10),
  LOGUX_ACTION_CHANNEL: getRequiredProcessEnv('LOGUX_ACTION_CHANNEL'),

  // Logging
  LOG_LEVEL: getOptionalProcessEnv('LOG_LEVEL'),
  MIDDLEWARE_VERBOSITY: getOptionalProcessEnv('MIDDLEWARE_VERBOSITY'),

  // Google
  FIRESTORE_MODEL_COLLECTION: getOptionalProcessEnv('FIRESTORE_MODEL_COLLECTION'),
  FIRESTORE_GPTPROMPT_COLLECTION: getOptionalProcessEnv('FIRESTORE_GPTPROMPT_COLLECTION') || 'gpt-prompts',
  PUBSUB_PROJECT_KEY: getOptionalProcessEnv('PUBSUB_PROJECT_KEY'),

  // OpenAI
  OPENAI_API_KEY: getRequiredProcessEnv('OPENAI_API_KEY'),
  OPENAI_ORG_ID: getRequiredProcessEnv('OPENAI_ORG_ID'),
};

export default CONFIG;
