import { UnusedFilesWebpackPlugin } from 'unused-files-webpack-plugin';
import merge from 'webpack-merge';

import paths from '../../paths';
import commonConfig from '../common';
import { circularDependencyPlugin } from '../common/utils';
import { IS_PRODUCTION, IS_SERVING } from '../config';

export default merge(commonConfig, {
  entry: {
    app: ['react-hot-loader/patch', paths.admin.entrypoint],
  },

  output: {
    path: paths.admin.buildDir,
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
            ignore: ['**/__tests__/**/*', '**/__mock__/**/*', '**/__mocks__/**/*', '!(admin)/**/*', '**/*.md', '*'],
          },
        }),
      ],
});
