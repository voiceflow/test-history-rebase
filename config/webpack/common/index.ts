/* eslint-disable no-process-env */
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import webpack from 'webpack';
import { action } from 'webpack-nano/argv';
import WebpackBar from 'webpackbar';

import { BASE_HREF, ENV, IS_CI, IS_PRODUCTION } from '../config';
import { tsConfigPathsPlugin } from './fragments';

const commonConfig: webpack.Configuration = {
  output: {
    publicPath: BASE_HREF,
  },

  resolve: {
    extensions: ['.js', '.json', '.jsx', '.ts', '.tsx', '.css'],
    plugins: [tsConfigPathsPlugin as any],
    symlinks: !!IS_CI,
  },

  plugins: [
    new webpack.DefinePlugin({
      ...Object.keys(ENV).reduce<Record<string, string>>((acc, key) => {
        acc[`process.env.${key}`] = JSON.stringify(ENV[key as keyof typeof ENV]);
        return acc;
      }, {}),
      'process.browser': JSON.stringify(true),
      'process.env.VF_OVERRIDE_API_HOST': JSON.stringify(process.env.VF_OVERRIDE_API_HOST || ''),
      'process.env.VF_OVERRIDE_ALEXA_SERVICE_ENDPOINT': JSON.stringify(process.env.VF_OVERRIDE_ALEXA_SERVICE_ENDPOINT || ''),
      'process.env.VF_OVERRIDE_GOOGLE_SERVICE_ENDPOINT': JSON.stringify(process.env.VF_OVERRIDE_GOOGLE_SERVICE_ENDPOINT || ''),
      'process.env.VF_OVERRIDE_GENERAL_SERVICE_ENDPOINT': JSON.stringify(process.env.VF_OVERRIDE_GENERAL_SERVICE_ENDPOINT || ''),
      'process.env.VF_OVERRIDE_GENERAL_RUNTIME_ENDPOINT': JSON.stringify(process.env.VF_OVERRIDE_GENERAL_RUNTIME_ENDPOINT || ''),
      'process.env.VF_OVERRIDE_CANVAS_EXPORT_ENDPOINT': JSON.stringify(process.env.VF_OVERRIDE_CANVAS_EXPORT_ENDPOINT || ''),
    }),
    new webpack.IgnorePlugin({ resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/ }),
    new WebpackBar({ name: `Voiceflow Creator - ${action || 'build'}` }),
    new webpack.BannerPlugin(`Voiceflow ${ENV.VERSION}`),

    ...(IS_PRODUCTION ? [] : [new CaseSensitivePathsPlugin()]),
  ],

  mode: IS_PRODUCTION ? 'production' : 'development',
  bail: IS_PRODUCTION,

  optimization: {
    runtimeChunk: 'single',
  },
};

export default commonConfig;
/* eslint-enable no-process-env */
