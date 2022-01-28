import { extractEnvironment } from '@voiceflow/webpack-config';
import branch from 'git-branch';
import { debug, debugFetch, debugNet, env, ga, host, logFilter, logLevel, logrocket, privateCloud, sentry } from 'webpack-nano/argv';

const { APP_ENV, NODE_ENV, CIRCLE_SHA1, CIRCLE_BRANCH, CIRCLE_TAG } = process.env;

const extractedEnv = extractEnvironment();

export default {
  NODE_ENV,
  APP_ENV: env || APP_ENV || 'local',
  E2E: 'false',

  // logging
  LOG_LEVEL: logLevel || '',
  LOG_FILTER: logFilter || '',

  // analytics
  GA_ENABLED: ga && 'true',
  GOOGLE_TAG_MANAGER_ID: '',

  // vendors
  LOGROCKET_ENABLED: logrocket && 'true',
  SENTRY_ENABLED: sentry && 'true',

  CLOUD_ENV: privateCloud || '',

  API_HOST: host || 'localhost',
  ROOT_DOMAIN: '',
  MAINTENANCE_STATUS_SOURCE: '',
  ...extractedEnv,
  VERSION: extractedEnv.VERSION || CIRCLE_TAG || `(${CIRCLE_BRANCH || CIRCLE_SHA1 || branch.sync()})`,
  ...(debug
    ? {
        DEBUG_NETWORK: true,
        LOG_LEVEL: logLevel === 'trace' ? logLevel : 'debug',
      }
    : {
        DEBUG_NETWORK: debugNet ? true : '',
        DEBUG_FETCH: debugFetch ? true : '',
      }),
};
