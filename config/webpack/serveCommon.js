const { WebpackPluginServe } = require('webpack-plugin-serve');
const fs = require('fs');
const path = require('path');
const paths = require('../paths');

module.exports = (port = 3000, buildDirectory = paths.buildDir) => ({
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
      port,
      host: 'localhost',
      open: true,
      compress: true,
      historyFallback: true,
      progress: 'minimal',

      // serve generated files, fallback to public
      static: [buildDirectory, paths.publicDir],

      https: {
        key: fs.readFileSync(path.resolve(__dirname, '../../certs/localhost.key')),
        cert: fs.readFileSync(path.resolve(__dirname, '../../certs/localhost.crt')),
      },
    }),
  ],

  watch: true,
});
