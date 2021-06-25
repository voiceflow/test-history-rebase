/* eslint-disable camelcase */

import { extractEnvironment } from '@voiceflow/webpack-config';
import branch from 'git-branch';
import {
  canvasCrosshair,
  debug,
  debugCanvas,
  debugFetch,
  debugNet,
  debugRealtime,
  debugSocket,
  env,
  ff_asrBypass,
  ff_conditionsBuilder,
  ff_gadgets,
  ff_linkCustomization,
  ff_motorolaSSO,
  ff_natoApco,
  ff_navigationRedesign,
  ff_ownerRole,
  ff_testReports,
  ff_wavenetVoices,
  ga,
  growsurf,
  host,
  intercom,
  logFilter,
  logLevel,
  logrocket,
  privateCloud,
  sentry,
  userflow,
} from 'webpack-nano/argv';

// eslint-disable-next-line no-process-env
const { APP_ENV, NODE_ENV, CIRCLE_SHA1, CIRCLE_BRANCH, CIRCLE_TAG } = process.env;

const extractedEnv = extractEnvironment();

export default {
  NODE_ENV,
  APP_ENV: env || APP_ENV || 'local',

  // logging
  LOG_LEVEL: logLevel || '',
  LOG_FILTER: logFilter || '',

  // canvas
  CANVAS_CROSSHAIR: canvasCrosshair && 'true',

  // analytics
  GA_ENABLED: ga && 'true',
  GOOGLE_TAG_MANAGER_ID: '',

  // vendors
  LOGROCKET_ENABLED: logrocket && 'true',
  INTERCOM_ENABLED: intercom && 'true',
  USERFLOW_ENABLED: userflow && 'true',
  SENTRY_ENABLED: sentry && 'true',
  GROWSURF_ENABLED: growsurf && 'true',

  CLOUD_ENV: privateCloud || '',

  // feature flags
  FF_GADGETS: ff_gadgets && 'true',
  FF_WAVENET_VOICES: ff_wavenetVoices && 'true',
  FF_OWNER_ROLE: ff_ownerRole && 'true',
  FF_ASR_BYPASS: ff_asrBypass && 'true',
  FF_NATO_ACPO: ff_natoApco && 'true',
  FF_CONDITIONS_BUILDER: ff_conditionsBuilder && 'true',
  FF_MOTOROLA_SSO: ff_motorolaSSO && 'true',
  FF_LINK_CUSTOMIZATION: ff_linkCustomization && 'true',
  FF_TEST_REPORTS: ff_testReports && 'true',
  FF_NAVIGATION_REDESIGN: ff_navigationRedesign && 'true',

  API_HOST: host || 'localhost',
  ROOT_DOMAIN: '',
  MAINTENANCE_STATUS_SOURCE: '',
  ...extractedEnv,
  VERSION: extractedEnv.VERSION || CIRCLE_TAG || `(${CIRCLE_BRANCH || CIRCLE_SHA1 || branch.sync()})`,
  ...(debug
    ? {
        DEBUG_NETWORK: true,
        DEBUG_REALTIME: true,
        DEBUG_CANVAS: true,
        LOG_LEVEL: logLevel === 'trace' ? logLevel : 'debug',
      }
    : {
        DEBUG_NETWORK: debugNet ? true : '',
        DEBUG_FETCH: debugFetch ? true : '',
        DEBUG_SOCKET: debugSocket ? true : '',
        DEBUG_REALTIME: debugRealtime ? true : '',
        DEBUG_CANVAS: debugCanvas ? true : '',
      }),
};
