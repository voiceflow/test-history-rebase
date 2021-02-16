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
              '**/*.story.*',
              '**/*.unit.*',
              '**/*.it.*',
              '**/pages/admin/**/*',
              'svgs/**/*.svg',
              'admin/**/*',
              'utils/testing/**/*',
              'pages/Canvas/managers/Display/templates/*.json',
              'pages/Canvas/managers/Integration/zapier.png',
              '**/types.ts',
              'store/types/**/*.ts',
              'models/**/*',

              // TODO: remove when new share system splash screens gets used
              'components/ShareSplashScreen/**/*',

              // TODO: delete when SubMenu gets used
              'components/SubMenu/**/*',

              // TODO: validate whether these components will be used
              'components/LegacyUpload/**/*',
              'components/DropdownButton/**/*',
            ],
          },
        }),
      ],
});
