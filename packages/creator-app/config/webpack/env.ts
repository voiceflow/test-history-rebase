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
  ff_account_page_redesign,
  ff_asrBypass,
  ff_atomicActions,
  ff_captureV2,
  ff_dialogflow,
  ff_gadgets,
  ff_googleCreate,
  ff_motorolaSSO,
  ff_natoApco,
  ff_ownerRole,
  ff_realtime_connection,
  ff_topicsAndComponents,
  ff_variable_states,
  ff_wavenetVoices,
  ga,
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

  CLOUD_ENV: privateCloud || '',

  // feature flags
  FF_GADGETS: ff_gadgets && 'true',
  FF_NATO_ACPO: ff_natoApco && 'true',
  FF_CAPTURE_V2: ff_captureV2 && 'true',
  FF_OWNER_ROLE: ff_ownerRole && 'true',
  FF_ASR_BYPASS: ff_asrBypass && 'true',
  FF_DIALOGFLOW: ff_dialogflow && 'true',
  FF_MOTOROLA_SSO: ff_motorolaSSO && 'true',
  FF_GOOGLE_CREATE: ff_googleCreate && 'true',
  FF_WAVENET_VOICES: ff_wavenetVoices && 'true',
  FF_ATOMIC_ACTIONS: ff_atomicActions && 'true',
  FF_TOPICS_AND_COMPONENTS: ff_topicsAndComponents && 'true',
  FF_ACCOUNT_PAGE_REDESIGN: ff_account_page_redesign && 'true',
  FF_VARIABLE_STATES: ff_variable_states && 'true',
  FF_REALTIME_CONNECTION: ff_realtime_connection && 'true',

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
