const { WebpackPluginServe } = require('webpack-plugin-serve');
const merge = require('webpack-merge');
const fs = require('fs');
const path = require('path');
const buildConfig = require('./build');
const paths = require('../paths');

module.exports = merge(buildConfig, {
  entry: {
    app: ['webpack-plugin-serve/client'],
  },

  devtool: 'cheap-eval-source-map',

  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },

  plugins: [
    new WebpackPluginServe({
      port: 3000,
      host: '0.0.0.0',
      open: false,
      compress: true,
      historyFallback: true,
      progress: 'minimal',

      client: {
        address: `${process.env.VF_APP_API_HOST}:3000`
      },
      // serve generated files, fallback to public
      static: [paths.buildDir, paths.publicDir],

      https: {
        key: fs.readFileSync(path.resolve(__dirname, '../../certs/localhost.key')),
        cert: fs.readFileSync(path.resolve(__dirname, '../../certs/localhost.crt')),
      },
    }),
  ],

  watch: true,
});
