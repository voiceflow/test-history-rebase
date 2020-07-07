import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import merge from 'webpack-merge';

import commonBuildConfig from '../common/build';
import { IS_SERVING } from '../config';
import commonConfig from './common';

export default merge(commonConfig, commonBuildConfig, {
  plugins: IS_SERVING ? [] : [new BundleAnalyzerPlugin({ analyzerMode: 'static' })],
});
