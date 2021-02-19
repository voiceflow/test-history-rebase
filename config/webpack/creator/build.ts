import path from 'path';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import merge from 'webpack-merge';
import { analyze } from 'webpack-nano/argv';

// import { instrument } from 'webpack-nano/argv';
import commonBuildConfig from '../common/build';
import { IS_SERVING } from '../config';
import commonConfig from './common';

export default merge(commonConfig, commonBuildConfig, {
  plugins:
    IS_SERVING || !analyze
      ? []
      : [
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: path.resolve(__dirname, '../../../bundle-report.html'),
          }),
        ],

  // ...(instrument && {
  //   devtool: 'source-map',
  // }),
});
