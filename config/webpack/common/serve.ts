import fs from 'fs';
import path from 'path';
import { host, open } from 'webpack-nano/argv';

import paths from '../../paths';
import { BASE_HREF } from '../config';

export default (port: number) => ({
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },

  devtool: 'eval-cheap-module-source-map',

  devServer: {
    port,
    host: host || 'localhost',
    open: open ?? true,
    historyApiFallback: true,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, '../../../certs/localhost.key')),
      cert: fs.readFileSync(path.resolve(__dirname, '../../../certs/localhost.crt')),
    },

    publicPath: BASE_HREF,
    contentBase: [paths.publicDir],

    inline: true,
    hot: true,
  },

  target: 'web',
});
