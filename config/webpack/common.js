const { action } = require('webpack-nano/argv');
const WebpackBar = require('webpackbar');
const webpack = require('webpack');
const paths = require('../paths');
const { IS_PRODUCTION, ENV } = require('./config');

module.exports = {
  entry: [paths.entrypoint],

  output: {
    path: paths.buildDir,
    pathinfo: !IS_PRODUCTION,
  },

  resolve: {
    modules: [paths.sourceDir, paths.modules],
    extensions: ['.js', '.json', '.jsx', '.css'],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': Object.keys(ENV).reduce((acc, key) => {
        acc[key] = JSON.stringify(ENV[key]);

        return acc;
      }, {}),
    }),
    new WebpackBar({ name: `webpack - ${action || 'build'}` }),
  ],

  mode: IS_PRODUCTION ? 'production' : 'development',
  bail: IS_PRODUCTION,

  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
};
