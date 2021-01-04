/* eslint-disable @typescript-eslint/no-var-requires, camelcase */

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
  ff_codeExport,
  ff_gadgets,
  ff_generalPlatform,
  ff_generalPrototype,
  ff_visualPrototype,
  ga,
  intercom,
  logFilter,
  logLevel,
  logrocket,
  privateCloud,
  tracking,
  userflow,
} from 'webpack-nano/argv';

const { NODE_ENV } = process.env;
const ENV_PREFIX = 'VF_APP_';

const EXTRACTED_ENV = Object.keys(process.env).reduce<Record<string, string | undefined>>((acc, key) => {
  if (key.startsWith(ENV_PREFIX)) {
    acc[key.slice(ENV_PREFIX.length)] = process.env[key];
  }

  return acc;
}, {});

export const IS_PRODUCTION = NODE_ENV === 'production';
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
  FF_GENERAL_PLATFORM: ff_generalPlatform && 'true',
  FF_GENERAL_PROTOTYPE: ff_generalPrototype && 'true',
  FF_CODE_EXPORT: ff_codeExport && 'true',
  FF_VISUAL_PROTOTYPE: ff_visualPrototype && 'true',

  API_HOST: 'localhost',
  ...EXTRACTED_ENV,
  VERSION: EXTRACTED_ENV.VERSION || `(${branch.sync()})`,
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
