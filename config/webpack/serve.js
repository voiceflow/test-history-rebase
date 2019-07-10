const { WebpackPluginServe } = require('webpack-plugin-serve');
const merge = require('webpack-merge');
const fs = require('fs');
const path = require('path');
const buildConfig = require('./build');
const paths = require('../paths');

module.exports = merge(buildConfig, {
  entry: ['webpack-plugin-serve/client'],

  devtool: 'cheap-eval-source-map',

  plugins: [
    new WebpackPluginServe({
      port: 3000,
      host: 'localhost',
      open: true,
      compress: true,
      historyFallback: true,

       // serve generated files, fallback to public
      static: [paths.buildDir, paths.publicDir],

       https: {
        key: fs.readFileSync(path.resolve(__dirname, '../../certs/localhost.key')),
        cert: fs.readFileSync(path.resolve(__dirname, '../../certs/localhost.crt')),
      },
    }),
  ],

  watch: true
});