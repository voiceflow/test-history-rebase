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
          exclude: /node_modules|src\/components\/Select\/components\/Menu(Options)?\/index\.jsx/,
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
              '**/pages/admin/**/*',
              'svgs/**/*.svg',
              'admin/**/*',
              'utils/testing/**/*',
              'utils/string.js',
              'utils/number.js',
              'pages/Canvas/managers/Display/templates/*.json',
              'pages/Canvas/managers/Integration/zapier.png',

              // TODO: remove when re-enabling display editor
              'components/Upload/JsonUpload/**/*',
              'utils/files.js',
              'pages/Canvas/managers/Display/**/*',
              
              // TODO: validate whether these components will be used
              'components/LegacyUpload/**/*',
              'pages/Canvas/components/Block/NewBlock/**/*',
              'pages/Canvas/components/Step/**/*',
              'components/CaptionedIconButton/**/*',
              'components/Dropdown/**/*',
              'components/DropdownButton/**/*',
              'components/Link/**/*',
              'components/Title/**/*'
            ],
          },
        }),
      ],
});
