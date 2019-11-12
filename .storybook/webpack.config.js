const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const paths = require('../config/paths');

const { ENV } = require('../config/webpack/config');

module.exports = ({ config }) =>
  merge.strategy({ 'module.rules': 'replace' })(config, {
    resolve: {
      alias: {
        '@': paths.sourceDir,
      },
    },

    module: {
      rules: [
        {
          oneOf: [
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
