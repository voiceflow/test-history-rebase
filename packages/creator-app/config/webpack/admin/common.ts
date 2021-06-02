import merge from 'webpack-merge';
import { validate } from 'webpack-nano/argv';

import paths from '../../paths';
import commonConfig from '../common';
import { circularDependencyPlugin, deadCodePlugin } from '../common/utils';
import { IS_SERVING } from '../config';

export default merge(commonConfig, {
  entry: {
    app: ['react-hot-loader/patch', paths.admin.entrypoint],
  },

  output: {
    path: paths.admin.buildDir,
  },

  plugins:
    IS_SERVING || !validate
      ? []
      : [
          circularDependencyPlugin({
            exclude: /node_modules|src\/components\/NestedMenu\/Menu(Options)?\/index\.jsx/,
          }),
          deadCodePlugin({
            exclude: ['**/__tests__/**/*', '**/__mock__/**/*', '**/__mocks__/**/*', '!(admin)/**/*', '**/*.md', '*'],
          }),
        ],

  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
    },
  } as any,
});
