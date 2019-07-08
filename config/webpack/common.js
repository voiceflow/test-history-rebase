const { action } = require('webpack-nano/argv');
const WebpackBar = require('webpackbar');
const paths = require('../paths');
const { IS_PRODUCTION } = require('./config');

module.exports = {
  entry: [paths.entrypoint],

  output: {
    path: paths.buildDir,
    pathinfo: !IS_PRODUCTION,
  },

  resolve: {
    modules: [paths.modules, paths.sourceDir],
    extensions: ['.js', '.json', '.jsx', '.css']
  },
  
  plugins: [
    new WebpackBar({ name: `webpack - ${action}` })
  ],

  mode: IS_PRODUCTION ? 'production': 'development',
  bail: IS_PRODUCTION,

  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
};