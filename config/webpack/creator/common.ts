import merge from 'webpack-merge';
import { strict, validate } from 'webpack-nano/argv';

import paths from '../../paths';
import commonConfig from '../common';
import { circularDependencyPlugin, deadCodePlugin } from '../common/utils';
import { IS_SERVING } from '../config';

export default merge(commonConfig, {
  entry: {
    app: ['react-hot-loader/patch', paths.entrypoint],
  },

  output: {
    path: paths.buildDir,
  },

  plugins: [
    ...((validate || strict) && !IS_SERVING
      ? [
          circularDependencyPlugin({
            exclude: /node_modules|src\/components\/NestedMenu\/Menu(Options)?\/index\.jsx/,
          }),
          deadCodePlugin({
            context: 'src',
            exclude: [
              '**/README.md',
              '**/__mocks__/**/*',
              '**/*.story.*',
              '**/*.unit.*',
              '**/*.it.*',
              '**/src/admin/**/*',
              '**/src/models/**/*',
              '**/src/utils/testing/**/*',
              '**/src/store/types/**/*',
              '**/src/**/types.ts',
            ],
          }),
        ]
      : []),
  ],

  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
    },
  } as any,
});
