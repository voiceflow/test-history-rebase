const { action } = require('webpack-nano/argv');
const WebpackBar = require('webpackbar');
const webpack = require('webpack');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');

const paths = require('../../paths');
const { BASE_HREF, IS_PRODUCTION, IS_SERVING, ENV } = require('../config');

module.exports = {
  output: {
    publicPath: BASE_HREF,
  },

  resolve: {
    extensions: ['.js', '.json', '.jsx', '.css'],
    alias: {
      '@': paths.sourceDir,
    },
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': Object.keys(ENV).reduce((acc, key) => {
        acc[key] = JSON.stringify(ENV[key]);

        return acc;
      }, {}),
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new WebpackBar({ name: `Voiceflow Creator - ${action || 'build'}` }),
    new webpack.BannerPlugin(`Voiceflow ${ENV.VERSION}`),

    ...(IS_PRODUCTION ? [
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.HashedModuleIdsPlugin(),
    ]: [
      new webpack.NamedModulesPlugin(),
      new CaseSensitivePathsPlugin(),
    ]),

    ...(IS_SERVING
      ? []
      : [
          new CircularDependencyPlugin({
            exclude: /node_modules/,
            allowAsyncCycles: true,
            cwd: process.cwd(),
            failOnError: true,

            onDetected({ paths, compilation }) {
              // ignore self-referencing modules
              if (paths.length > 2) {
                compilation.warnings.push(new Error(`Circular dependency detected:\n${paths.join(' -> ')}`));
              }
            },
          }),
        ]),
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
