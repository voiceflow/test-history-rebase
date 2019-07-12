const merge = require('webpack-merge');
const paths = require('../config/paths');

module.exports = ({ config }) =>
  merge.strategy({ 'module.rules': 'replace' })(config, {
    resolve: {
      alias: {
        '@': paths.sourceDir
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
  });
