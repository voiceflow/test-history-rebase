/* eslint-disable no-process-env, camelcase */

import branch from 'git-branch';
import {
  action,
  canvasCrosshair,
  debug,
  debugCanvas,
  debugHttp,
  debugNet,
  debugRealtime,
  debugSocket,
  env,
  ff_asrBypass,
  ff_gadgets,
  ff_natoApco,
  ff_ownerRole,
  ff_trace,
  ff_wavenetVoices,
  ga,
  host,
  intercom,
  logFilter,
  logLevel,
  logrocket,
  privateCloud,
  tracking,
  userflow,
} from 'webpack-nano/argv';

const { NODE_ENV, CI, CIRCLE_SHA1, CIRCLE_BRANCH, CIRCLE_TAG } = process.env;
const ENV_PREFIX = 'VF_APP_';

const EXTRACTED_ENV = Object.keys(process.env).reduce<Record<string, string | undefined>>((acc, key) => {
  if (key.startsWith(ENV_PREFIX)) {
    acc[key.slice(ENV_PREFIX.length)] = process.env[key];
  }

  return acc;
}, {});

export const IS_PRODUCTION = NODE_ENV === 'production';
export const IS_CI = !!CI;
export const IS_SERVING = action === 'serve' || action === 'admin-serve';
export const IS_ADMIN = action === 'admin' || action === 'admin-serve';
export const BASE_HREF = '/';

export const ENV = {
  NODE_ENV,
  APP_ENV: env || process.env.APP_ENV || 'local',

  // logging
  LOG_LEVEL: logLevel || '',
  LOG_FILTER: logFilter || '',

  // canvas
  CANVAS_CROSSHAIR: canvasCrosshair && 'true',

  // analytics
  GA_ENABLED: ga && 'true',
  TRACKING_ENABLED: tracking && 'true',
  GOOGLE_TAG_MANAGER_ID: '',

  // vendors
  LOGROCKET_ENABLED: logrocket && 'true',
  INTERCOM_ENABLED: intercom && 'true',
  USERFLOW_ENABLED: userflow && 'true',

  CLOUD_ENV: privateCloud || '',

  // feature flags
  FF_GADGETS: ff_gadgets && 'true',
  FF_TRACE: ff_trace && 'true',
  FF_WAVENET_VOICES: ff_wavenetVoices && 'true',
  FF_OWNER_ROLE: ff_ownerRole && 'true',
  FF_ASR_BYPASS: ff_asrBypass && 'true',
  FF_NATO_ACPO: ff_natoApco && 'true',

  API_HOST: host || 'localhost',
  ROOT_DOMAIN: '',
  MAINTENANCE_STATUS_SOURCE: '',
  ...EXTRACTED_ENV,
  VERSION: EXTRACTED_ENV.VERSION || CIRCLE_TAG || `(${CIRCLE_BRANCH || CIRCLE_SHA1 || branch.sync()})`,
  ...(debug
    ? {
        DEBUG_NETWORK: true,
        DEBUG_REALTIME: true,
        DEBUG_CANVAS: true,
        LOG_LEVEL: logLevel === 'trace' ? logLevel : 'debug',
      }
    : {
        DEBUG_NETWORK: debugNet ? true : '',
        DEBUG_HTTP: debugHttp ? true : '',
        DEBUG_SOCKET: debugSocket ? true : '',
        DEBUG_REALTIME: debugRealtime ? true : '',
        DEBUG_CANVAS: debugCanvas ? true : '',
      }),
};
