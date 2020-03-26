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
              '**/types.ts',
              'models/**/*',

              // TODO: remove when onboarding redesign
              'pages/OnboardingV2/**/*',

              // TODO: remove when releasing step redesign
              'pages/Canvas/managers/*/*Step/**/*',
              'pages/Canvas/managers/Start/StartBlock/**/*',
              'pages/Canvas/managers/Command/CommandStep.tsx',
              'components/CustomScrollbars/**/*',

              // TODO: validate whether these components will be used
              'components/LegacyUpload/**/*',
              'components/CaptionedIconButton/**/*',
              'components/Dropdown/**/*',
              'components/DropdownButton/**/*',
              'components/Link/**/*',
              'components/Title/**/*',
            ],
          },
        }),
      ],
});
