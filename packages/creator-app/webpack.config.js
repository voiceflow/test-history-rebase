/* eslint-disable no-process-env, global-require */
require('ts-node/register/transpile-only');

const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const { action, env, prod } = require('webpack-nano/argv');

process.env.NODE_ENV = prod ? 'production' : 'development';

const environment = env || process.env.VF_APP_BUILD_ENV || 'local';
const envFile = path.resolve(process.cwd(), `.env${environment ? `.${environment}` : ''}`);
if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
}

dotenv.config();

module.exports = () => {
  switch (action) {
    case 'serve':
      return require('./config/webpack/creator/serve').default;
    case 'admin':
      return require('./config/webpack/admin/build').default;
    case 'admin-serve':
      return require('./config/webpack/admin/serve').default;
    case 'build':
    default:
      return require('./config/webpack/creator/build').default;
  }
};
