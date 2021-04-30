import fs from 'fs';
import path from 'path';
import { host } from 'webpack-nano/argv';

import paths from '../../paths';
import { BASE_HREF } from '../config';

// eslint-disable-next-line no-process-env
const isE2E = process.env.E2E === 'true';

export default (port: number) => ({
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },

  devtool: 'eval-cheap-module-source-map',

  devServer: {
    port: isE2E ? 3002 : port,
    host: host || 'localhost',
    open: false,
    historyApiFallback: true,
    disableHostCheck: true,
    public: 'creator-local.development.voiceflow.com:3002',
    https: isE2E
      ? {
          key: fs.readFileSync(path.resolve(__dirname, '../../../certs/localhost.key')),
          cert: fs.readFileSync(path.resolve(__dirname, '../../../certs/localhost.crt')),
        }
      : false,
    publicPath: BASE_HREF,
    contentBase: [paths.publicDir],
    compress: true,
    inline: true,
    hot: true,
  },

  target: 'web',
});
