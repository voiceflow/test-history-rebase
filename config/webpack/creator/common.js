const merge = require('webpack-merge');
const { UnusedFilesWebpackPlugin } = require('unused-files-webpack-plugin');

const paths = require('../../paths');
const commonConfig = require('../common');
const { circularDependencyPlugin } = require('../common/utils');
const { IS_SERVING, IS_PRODUCTION } = require('../config');

module.exports = merge(commonConfig, {
  entry: {
    app: ['react-hot-loader/patch', paths.entrypoint],
  },

  output: {
    path: paths.buildDir,
  },

  plugins: IS_SERVING
    ? []
    : [
        circularDependencyPlugin({
          exclude: /node_modules|src\/componentsV2\/Select\/components\/Menu(Options)?\/index\.jsx/,
        }),
        new UnusedFilesWebpackPlugin({
          failOnUnused: IS_PRODUCTION,
          globOptions: {
            cwd: paths.sourceDir,
            ignore: [
              'assets/**/*',
              '**/__tests__/**/*',
              '**/__mock__/**/*',
              '**/__mocks__/**/*',
              '**/__snapshots__/**/*',
              '**/*.story.*',
              '**/*.unit.*',
              '**/*.it.*',
              '**/containers/admin/**/*',
              'svgs/**/*.svg',
              'admin/**/*',
              'utils/testing/**/*',
              'utils/string.js',
              'utils/number.js',
              'containers/CanvasV2/managers/Display/templates/*.json',
              'containers/CanvasV2/managers/Integration/zapier.png',

              // TODO: validate whether these components will be used
              'components/Uploads/**/*',
              'containers/CanvasV2/components/Block/NewBlock/**/*',
              'containers/CanvasV2/components/Step/**/*',
              'componentsV2/CaptionedIconButton/**/*',
              'componentsV2/Dropdown/**/*',
              'componentsV2/DropdownButton/**/*',
              'componentsV2/Link/**/*',
              'componentsV2/Title/**/*'
            ],
          },
        }),
      ],
});
