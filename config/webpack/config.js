const branch = require('git-branch');
const { action, env, logrocket, debug, debugNet, debugHttp, debugSocket } = require('webpack-nano/argv');

const { NODE_ENV } = process.env;
const ENV_PREFIX = 'VF_APP_';

module.exports = {
  IS_PRODUCTION: NODE_ENV === 'production',
  IS_SERVING: action === 'serve' || action === 'admin-serve',
  IS_ADMIN: action === 'admin' || action === 'admin-serve',
  BASE_HREF: '/',

  ENV: {
    NODE_ENV,
    BUILD_ENV: env || process.env.BUILD_ENV || 'local',
    LOGROCKET_ENABLED: logrocket && 'true',
    API_HOST: 'localhost',
    VERSION: process.env.VERSION || `(${branch.sync()})`,
    ...Object.keys(process.env).reduce((acc, key) => {
      if (key.startsWith(ENV_PREFIX)) {
        acc[key.slice(ENV_PREFIX.length)] = process.env[key];
      }

      return acc;
    }, {}),
    ...(debug ? {
      DEBUG_NETWORK: true
    }: {
      DEBUG_NETWORK: debugNet ? true : '',
      DEBUG_HTTP: debugHttp ? true : '',
      DEBUG_SOCKET: debugSocket ? true : '',
    })
  },
};
