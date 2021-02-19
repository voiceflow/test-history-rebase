import fs from 'fs';
import path from 'path';
import { host, open } from 'webpack-nano/argv';
import { WebpackPluginServe } from 'webpack-plugin-serve';

import paths from '../../paths';

export default (port: number, buildDirectory = paths.buildDir) => ({
  entry: {
    app: ['webpack-plugin-serve/client'],
  },

  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },

  devtool: 'eval-cheap-module-source-map',

  plugins: [
    new WebpackPluginServe({
      port,
      host: host || 'localhost',
      open: open ?? true,
      historyFallback: true,
      progress: 'minimal',

      // serve generated files, fallback to public
      static: [buildDirectory, paths.publicDir],

      https: {
        key: fs.readFileSync(path.resolve(__dirname, '../../../certs/localhost.key')),
        cert: fs.readFileSync(path.resolve(__dirname, '../../../certs/localhost.crt')),
      },
    }),
  ],

  watch: true,
});
