import { getOptionalProcessEnv, getRequiredProcessEnv, setupEnv } from '@voiceflow/backend-utils';

import { Config } from './types';

setupEnv();

const NODE_ENV = getRequiredProcessEnv('NODE_ENV');
const CLOUD_ENV = getOptionalProcessEnv('CLOUD_ENV', 'public');

const GOOGLE_SERVICE_ENDPOINT = getRequiredProcessEnv('GOOGLE_SERVICE_ENDPOINT');
const CONFIG: Config = {
  NODE_ENV,
  PORT: parseInt(getRequiredProcessEnv('PORT'), 10),

  // Deployment information
  CLOUD_ENV,
  IS_PRIVATE_CLOUD: NODE_ENV === 'production' && CLOUD_ENV !== 'public',
  // TODO: undo
  CREATOR_API_ENDPOINT: getRequiredProcessEnv('CREATOR_API_ENDPOINT'),
  ALEXA_SERVICE_ENDPOINT: getRequiredProcessEnv('ALEXA_SERVICE_ENDPOINT'),
  GOOGLE_SERVICE_ENDPOINT,
  DIALOGFLOW_SERVICE_ENDPOINT: `${GOOGLE_SERVICE_ENDPOINT}/dialogflow/es`,
  GENERAL_SERVICE_ENDPOINT: getRequiredProcessEnv('GENERAL_SERVICE_ENDPOINT'),

  // Release information
  GIT_SHA: getOptionalProcessEnv('GIT_SHA'),
  BUILD_NUM: getOptionalProcessEnv('BUILD_NUM'),
  SEM_VER: getOptionalProcessEnv('SEM_VER'),
  BUILD_URL: getOptionalProcessEnv('BUILD_URL'),

  // Redis
  REDIS_CLUSTER_HOST: getRequiredProcessEnv('REDIS_CLUSTER_HOST'),
  REDIS_CLUSTER_PORT: parseInt(getRequiredProcessEnv('REDIS_CLUSTER_PORT'), 10),

  // Logging
  LOG_LEVEL: getOptionalProcessEnv('LOG_LEVEL'),
  MIDDLEWARE_VERBOSITY: getOptionalProcessEnv('MIDDLEWARE_VERBOSITY'),
};

export default CONFIG;
