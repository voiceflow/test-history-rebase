const { action } = require('webpack-nano/argv');
const WebpackBar = require('webpackbar');
const webpack = require('webpack');
const { UnusedFilesWebpackPlugin } = require('unused-files-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const paths = require('../paths');
const { BASE_HREF, IS_PRODUCTION, ENV } = require('./config');

module.exports = {
  entry: {
    app: ['react-hot-loader/patch', paths.entrypoint],
  },

  output: {
    path: paths.buildDir,
    publicPath: BASE_HREF,
    pathinfo: !IS_PRODUCTION,
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
    new UnusedFilesWebpackPlugin({
      failOnUnused: IS_PRODUCTION,
      globOptions: {
        cwd: paths.sourceDir,
        ignore: [
          'assets/**/*',
          '**/__tests__/**/*',
          '**/__mock__/**/*',
          '**/__mocks__/**/*',
          'components/SRD/sass/**/*',
          'setupTests.js',
          // TODO: To be removed once SvgIcon component is being used in the app
          'components/SvgIcon/*',
          // TODO: To be removed once V2 components are being used
          'componentsV2/**/*',
          'svgs/**/*',
        ],
      },
    }),
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
