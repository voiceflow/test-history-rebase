/* eslint-disable no-process-env */

import dotenv from 'dotenv';
import fs from 'fs';
import branch from 'git-branch';
import path from 'path';

type Env = Record<string, string | undefined>;

export const loadEnv = () => {
  const environment = process.env.VF_APP_BUILD_ENV || 'local';

  const envFile = path.resolve(process.cwd(), `.env${environment ? `.${environment}` : ''}`);

  if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
  }

  dotenv.config();

  const { env } = process;

  const {
    DEBUG,
    APP_ENV,
    API_HOST,
    NODE_ENV,
    CLOUD_ENV,
    LOG_LEVEL,
    LOG_FILTER,
    GA_ENABLED,
    CIRCLE_TAG,
    CIRCLE_SHA1,
    SOURCE_MAPS,
    DEBUG_FETCH,
    DEBUG_SOCKET,
    DEBUG_CANVAS,
    DEBUG_NETWORK,
    CIRCLE_BRANCH,
    DEBUG_REALTIME,
    SENTRY_ENABLED,
    CANVAS_CROSSHAIR,
  } = env;

  const extractedEnvs = Object.keys(env).reduce<Record<string, string | undefined>>((acc, key) => {
    if (key.startsWith('VF_APP_')) {
      acc[key.replace('VF_APP_', '')] = env[key];
    } else if (key.startsWith('VF_OVERRIDE_')) {
      acc[key] = env[key];
    }

    return acc;
  }, {});

  const ENV: Env = {
    APP_ENV: APP_ENV || 'local',
    NODE_ENV,
    SOURCE_MAPS,

    CANVAS_CROSSHAIR: CANVAS_CROSSHAIR || '',

    // logging
    // eslint-disable-next-line no-nested-ternary
    LOG_LEVEL: DEBUG ? (LOG_LEVEL === 'trace' ? LOG_LEVEL : 'debug') : LOG_LEVEL || '',
    LOG_FILTER: LOG_FILTER || '',

    // analytics
    GA_ENABLED: (GA_ENABLED && 'true') || '',
    GOOGLE_TAG_MANAGER_ID: '',

    // vendors
    SENTRY_ENABLED: (SENTRY_ENABLED && 'true') || '',

    CLOUD_ENV: CLOUD_ENV || '',

    API_HOST: API_HOST || 'localhost',
    ROOT_DOMAIN: '',
    MAINTENANCE_STATUS_SOURCE: '',
    ...extractedEnvs,

    VERSION: extractedEnvs.VERSION || CIRCLE_TAG || `(${CIRCLE_BRANCH || CIRCLE_SHA1 || branch.sync()})`,
    VF_OVERRIDE_API_HOST: extractedEnvs.VF_OVERRIDE_API_HOST || '',
    VF_OVERRIDE_CANVAS_EXPORT_ENDPOINT: extractedEnvs.VF_OVERRIDE_CANVAS_EXPORT_ENDPOINT || '',
    VF_OVERRIDE_ALEXA_SERVICE_ENDPOINT: extractedEnvs.VF_OVERRIDE_ALEXA_SERVICE_ENDPOINT || '',
    VF_OVERRIDE_GOOGLE_SERVICE_ENDPOINT: extractedEnvs.VF_OVERRIDE_GOOGLE_SERVICE_ENDPOINT || '',
    VF_OVERRIDE_GENERAL_SERVICE_ENDPOINT: extractedEnvs.VF_OVERRIDE_GENERAL_SERVICE_ENDPOINT || '',
    VF_OVERRIDE_GENERAL_RUNTIME_ENDPOINT: extractedEnvs.VF_OVERRIDE_GENERAL_RUNTIME_ENDPOINT || '',

    ...(DEBUG
      ? {
          DEBUG_FETCH: 'true',
          DEBUG_SOCKET: 'true',
          DEBUG_CANVAS: 'true',
          DEBUG_NETWORK: 'true',
          DEBUG_REALTIME: 'true',
        }
      : {
          DEBUG_FETCH: DEBUG_FETCH ? 'true' : '',
          DEBUG_SOCKET: DEBUG_SOCKET ? 'true' : '',
          DEBUG_CANVAS: DEBUG_CANVAS ? 'true' : '',
          DEBUG_NETWORK: DEBUG_NETWORK ? 'true' : '',
          DEBUG_REALTIME: DEBUG_REALTIME ? 'true' : '',
        }),
  };

  const ENV_TO_INJECT = Object.keys(ENV).reduce<Env>((acc, key) => Object.assign(acc, { [`process.env.${key}`]: JSON.stringify(ENV[key]) }), {});

  return {
    ENV,
    ENV_TO_INJECT,
  };
};
