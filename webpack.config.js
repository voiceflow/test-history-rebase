/* eslint-disable global-require */
const { action, prod, env } = require('webpack-nano/argv');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

process.env.NODE_ENV = prod ? 'production' : 'development';

dotenv.config();

const environment = env || process.env.BUILD_ENV || 'local';
const envFile = path.resolve(process.cwd(), `.env${environment ? `.${environment}` : ''}`);
if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
}

module.exports = () => {
  switch (action) {
    case 'build':
    default:
      return require('./config/webpack/build');
    case 'serve':
      return require('./config/webpack/serve');
  }
};
