const merge = require('webpack-merge');
const { UnusedFilesWebpackPlugin } = require('unused-files-webpack-plugin');

const paths = require('../../paths');
const commonConfig = require('../common');
const { IS_PRODUCTION, IS_SERVING } = require('../config');

module.exports = merge(commonConfig, {
  entry: {
    app: ['react-hot-loader/patch', paths.admin.entrypoint],
  },

  output: {
    path: paths.admin.buildDir,
  },

  plugins: IS_SERVING
    ? []
    : [
        new UnusedFilesWebpackPlugin({
          failOnUnused: IS_PRODUCTION,
          globOptions: {
            cwd: paths.sourceDir,
            ignore: [
              '**/__tests__/**/*',
              '**/__mock__/**/*',
              '**/__mocks__/**/*',
              '!(admin)/**/*',
              '**/*.md',
              '*',
            ],
          },
        }),
      ],
});
