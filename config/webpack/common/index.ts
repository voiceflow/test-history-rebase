import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import path from 'path';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import webpack from 'webpack';
import { action } from 'webpack-nano/argv';
import WebpackBar from 'webpackbar';

import { BASE_HREF, ENV, IS_PRODUCTION } from '../config';

const commonConfig: webpack.Configuration = {
  output: {
    publicPath: BASE_HREF,
  },

  resolve: {
    extensions: ['.js', '.json', '.jsx', '.ts', '.tsx', '.css'],
    alias: {
      lodash: 'lodash-es',
    },
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, '../../../tsconfig.build.json'),
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
      }),
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': Object.keys(ENV).reduce<Record<string, string>>((acc, key) => {
        acc[key] = JSON.stringify(ENV[key as keyof typeof ENV]);

        return acc;
      }, {}),
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new WebpackBar({ name: `Voiceflow Creator - ${action || 'build'}` }),
    new webpack.BannerPlugin(`Voiceflow ${ENV.VERSION}`),

    ...(IS_PRODUCTION
      ? [new webpack.optimize.ModuleConcatenationPlugin(), new webpack.HashedModuleIdsPlugin()]
      : [new webpack.NamedModulesPlugin(), new CaseSensitivePathsPlugin()]),
  ],

  mode: IS_PRODUCTION ? 'production' : 'development',
  bail: IS_PRODUCTION,

  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
};

export default commonConfig;
