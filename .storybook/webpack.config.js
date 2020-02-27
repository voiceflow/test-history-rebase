const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const paths = require('../config/paths');

const { ENV, IS_PRODUCTION } = require('../config/webpack/config');

const BABEL_LOADER = {
  loader: 'babel-loader',
  options: {
    cacheDirectory: true,
    cacheCompression: IS_PRODUCTION,
    compact: IS_PRODUCTION,
  },
};

module.exports = ({ config }) =>
  merge.strategy({ 'module.rules': 'replace' })(config, {
    resolve: {
      alias: {
        '@': paths.sourceDir,
      },
      extensions: ['.ts', '.tsx'],
    },

    module: {
      rules: [
        {
          oneOf: [
            {
              test: /\.story\.[jt]sx?$/,
              loaders: [BABEL_LOADER, require.resolve('@storybook/source-loader')],
              enforce: 'pre',
            },
            {
              test: /\.[jt]sx?$/,
              include: paths.sourceDir,
              ...BABEL_LOADER,
            },
            {
              test: /\.svg$/,
              include: path.resolve(paths.sourceDir, 'svgs'),
              use: ({ resource }) => ({
                loader: '@svgr/webpack',
                options: {
                  svgoConfig: {
                    plugins: [
                      {
                        cleanupIDs: {
                          prefix: `ID-${resource}`,
                        },
                      },
                    ],
                  },
                },
              }),
            },

            ...config.module.rules,
          ],
        },
      ],
    },

    plugins: [
      new webpack.DefinePlugin({
        'process.env': Object.keys(ENV).reduce((acc, key) => {
          acc[key] = JSON.stringify(ENV[key]);

          return acc;
        }, {}),
      }),
    ],
  });
