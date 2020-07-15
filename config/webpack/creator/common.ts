import { UnusedFilesWebpackPlugin } from 'unused-files-webpack-plugin';
import merge from 'webpack-merge';

import paths from '../../paths';
import commonConfig from '../common';
import { circularDependencyPlugin } from '../common/utils';
import { IS_PRODUCTION, IS_SERVING } from '../config';

export default merge(commonConfig, {
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
          exclude: /node_modules|src\/components\/NestedMenu\/Menu(Options)?\/index\.jsx/,
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

              // TODO: remove when commenting is fully implemented
              'components/Commenter.tsx',
              'pages/Canvas/components/ThreadEditor/**/*',
              // TODO: validate whether these components will be used
              'components/LegacyUpload/**/*',
              'components/CaptionedIconButton/**/*',
              'components/Dropdown/**/*',
              'components/DropdownButton/**/*',
              'components/Link/**/*',
              'components/Title/**/*',
              'components/MentionEditor/**/*',
              'components/CommentPreview.tsx',
            ],
          },
        }),
      ],
});
