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
              use: ['babel-loader', '@svgr/webpack'],
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
