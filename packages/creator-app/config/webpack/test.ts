import { composeConfigs } from '@voiceflow/webpack-config';
import { svgLoader, typescriptLoader } from '@voiceflow/webpack-config/build/loaders';
import webpack from 'webpack';

import commonConfig from './common';
import opts from './opts';

export default composeConfigs(commonConfig, (wpConfig, config) => ({
  ...wpConfig,
  plugins: [new webpack.NormalModuleReplacementPlugin(/\.(gif|png|css)$/, 'node-noop')],

  module: {
    rules: [
      {
        oneOf: [typescriptLoader(config), svgLoader(config)],
      },
    ],
  },
}))(opts);
