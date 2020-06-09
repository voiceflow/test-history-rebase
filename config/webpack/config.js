/* eslint-disable @typescript-eslint/no-var-requires, camelcase */

const branch = require('git-branch');
const {
  action,
  env,
  logrocket,
  intercom,
  ga,
  userflow,
  tracking,
  debug,
  debugNet,
  debugHttp,
  debugRealtime,
  debugSocket,
  logLevel,
  logFilter,
  ff_markup,
  ff_canvasExport,
  ff_repromptEditor,
  ff_templates,
  ff_gadgets,
  ff_promptEditor,
  ff_commenting,
} = require('webpack-nano/argv');

const { NODE_ENV } = process.env;
const ENV_PREFIX = 'VF_APP_';

const ENV = Object.keys(process.env).reduce((acc, key) => {
  if (key.startsWith(ENV_PREFIX)) {
    acc[key.slice(ENV_PREFIX.length)] = process.env[key];
  }

  return acc;
}, {});

module.exports = {
  IS_PRODUCTION: NODE_ENV === 'production',
  IS_SERVING: action === 'serve' || action === 'admin-serve',
  IS_ADMIN: action === 'admin' || action === 'admin-serve',
  BASE_HREF: '/',

  ENV: {
    NODE_ENV,
    BUILD_ENV: env || process.env.BUILD_ENV || 'local',

    // logging
    LOG_LEVEL: logLevel || '',
    LOG_FILTER: logFilter || '',

    // analytics
    GA_ENABLED: ga && 'true',
    TRACKING_ENABLED: tracking && 'true',

    // vendors
    LOGROCKET_ENABLED: logrocket && 'true',
    INTERCOM_ENABLED: intercom && 'true',
    USERFLOW_ENABLED: userflow && 'true',

    // feature flags
    FF_MARKUP: ff_markup && 'true',
    FF_CANVAS_EXPORT: ff_canvasExport && 'true',
    FF_REPROMPT_EDITOR: ff_repromptEditor && 'true',
    FF_TEMPLATES: ff_templates && 'true',
    FF_GADGETS: ff_gadgets && 'true',
    FF_PROMPT_EDITOR: ff_promptEditor && 'true',
    FF_COMMENTING: ff_commenting && 'true',

    API_HOST: 'localhost',
    ...ENV,
    VERSION: ENV.VERSION || `(${branch.sync()})`,
    ...(debug
      ? {
          DEBUG_NETWORK: true,
          DEBUG_REALTIME: true,
          LOG_LEVEL: logLevel === 'trace' ? logLevel : 'debug',
        }
      : {
          DEBUG_NETWORK: debugNet ? true : '',
          DEBUG_HTTP: debugHttp ? true : '',
          DEBUG_SOCKET: debugSocket ? true : '',
          DEBUG_REALTIME: debugRealtime ? true : '',
        }),
  },
};
