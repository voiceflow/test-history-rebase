const { action, logrocket } = require('webpack-nano/argv');

const { NODE_ENV } = process.env;
const ENV_PREFIX = 'VF_APP_';

module.exports = {
  IS_PRODUCTION: NODE_ENV === 'production',
  IS_SERVING: action === 'serve',
  BASE_HREF: '/',

  ENV: {
    NODE_ENV,
    LOGROCKET_ENABLED: logrocket && 'true',
    ...Object.keys(process.env).reduce(
      (acc, key) => {
        if (key.startsWith(ENV_PREFIX)) {
          acc[key.slice(ENV_PREFIX.length)] = process.env[key];
        }

        return acc;
      }, {}
    )
  }
};