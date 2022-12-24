import { getOptionalProcessEnv, getRequiredProcessEnv, setupEnv } from '@voiceflow/backend-utils';
import dotenv from 'dotenv';

import { Config } from './types';

dotenv.config({ path: '.env.local' });
setupEnv();

const NODE_ENV = getRequiredProcessEnv('NODE_ENV');
const CLOUD_ENV = getOptionalProcessEnv('CLOUD_ENV', 'public');

const GOOGLE_SERVICE_ENDPOINT = getRequiredProcessEnv('GOOGLE_SERVICE_ENDPOINT');
const CONFIG: Config = {
  NODE_ENV,
  PORT: parseInt(getRequiredProcessEnv('PORT'), 10),
  PORT_IO: parseInt(getRequiredProcessEnv('PORT_IO'), 10),
  PORT_METRICS: getOptionalProcessEnv('PORT_METRICS') === null ? null : parseInt(getRequiredProcessEnv('PORT_METRICS'), 10),

  // Deployment information
  CLOUD_ENV,
  DEPLOY_ENV: getOptionalProcessEnv('DEPLOY_ENV') || NODE_ENV,
  IS_PRIVATE_CLOUD: NODE_ENV === 'production' && CLOUD_ENV !== 'public',
  CREATOR_API_ENDPOINT: getRequiredProcessEnv('CREATOR_API_ENDPOINT'),
  ALEXA_SERVICE_ENDPOINT: getRequiredProcessEnv('ALEXA_SERVICE_ENDPOINT'),
  GOOGLE_SERVICE_ENDPOINT,
  DIALOGFLOW_SERVICE_ENDPOINT: `${GOOGLE_SERVICE_ENDPOINT}/dialogflow/es`,
  GENERAL_SERVICE_ENDPOINT: getRequiredProcessEnv('GENERAL_SERVICE_ENDPOINT'),
  IDENTITY_API_ENDPOINT: getRequiredProcessEnv('IDENTITY_API_ENDPOINT'),
  BILLING_API_ENDPOINT: getRequiredProcessEnv('BILLING_API_ENDPOINT'),

  // Release information
  GIT_SHA: getOptionalProcessEnv('GIT_SHA'),
  BUILD_NUM: getOptionalProcessEnv('BUILD_NUM'),
  SEM_VER: getOptionalProcessEnv('SEM_VER'),
  BUILD_URL: getOptionalProcessEnv('BUILD_URL'),

  // Redis
  REDIS_CLUSTER_HOST: getRequiredProcessEnv('REDIS_CLUSTER_HOST'),
  REDIS_CLUSTER_PORT: parseInt(getRequiredProcessEnv('REDIS_CLUSTER_PORT'), 10),

  // MongoDB
  MONGO_URI: getRequiredProcessEnv('MONGO_URI'),
  MONGO_DB: getRequiredProcessEnv('MONGO_DB'),

  // Logux
  LOGUX_ACTION_CHANNEL: getRequiredProcessEnv('LOGUX_ACTION_CHANNEL'),

  // Logging
  LOG_LEVEL: getOptionalProcessEnv('LOG_LEVEL'),
  MIDDLEWARE_VERBOSITY: getOptionalProcessEnv('MIDDLEWARE_VERBOSITY'),

  // Feature flags
  FEATURE_OVERRIDES: Object.fromEntries(
    Object.entries(process.env).flatMap(([key, value]) => (key.startsWith('FF_') ? [[key.substring(3).toLowerCase(), value === 'true']] : []))
  ),

  // Unleash
  UNLEASH_URL: getRequiredProcessEnv('UNLEASH_URL'),
  UNLEASH_API_KEY: getRequiredProcessEnv('UNLEASH_API_KEY'),

  // Hashid
  TEAM_HASH: getRequiredProcessEnv('TEAM_HASH'),
};

export default CONFIG;
