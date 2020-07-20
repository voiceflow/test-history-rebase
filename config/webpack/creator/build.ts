import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import merge from 'webpack-merge';
import { instrument } from 'webpack-nano/argv';

import commonBuildConfig from '../common/build';
import { IS_SERVING } from '../config';
import commonConfig from './common';

export default merge(commonConfig, commonBuildConfig, {
  plugins: IS_SERVING ? [] : [new BundleAnalyzerPlugin({ analyzerMode: 'static' })],

  ...(instrument && {
    devtool: 'source-map',
  }),
});
