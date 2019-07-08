const { action, prod } = require('webpack-nano/argv');

process.env.NODE_ENV = prod ? 'production' : 'development';

module.exports = () => {
  switch (action) {
    case 'build':
    default:
      return require('./config/webpack/build');
    case 'serve':
      return require('./config/webpack/serve');
  }
};