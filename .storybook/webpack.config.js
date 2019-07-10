const merge = require('webpack-merge');

module.exports = ({ config }) =>
  merge(config, {
    module: {
      rules: [
        {
          test: /\.svg$/,
          use: ['babel-loader', '@svgr/webpack'],
        },
      ],
    },
  });
