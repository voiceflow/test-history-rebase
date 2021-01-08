import webpack from 'webpack';

import { svgLoader, typescriptLoader } from '../common/fragments';
import commonConfig from './common';

export default {
  ...commonConfig,

  plugins: [new webpack.NormalModuleReplacementPlugin(/\.(gif|png|css)$/, 'node-noop')],

  module: {
    rules: [
      {
        oneOf: [typescriptLoader, svgLoader],
      },
    ],
  },
};
