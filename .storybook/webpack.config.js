const merge = require('webpack-merge');

module.exports = ({ config }) => merge.strategy({ 'module.rules': 'replace' })(config, {
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
