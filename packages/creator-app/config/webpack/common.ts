import { extendConfig, resolvePath } from '@voiceflow/webpack-config';
import commonConfig from '@voiceflow/webpack-config/build/configs/common';
import webpack from 'webpack';

export default extendConfig(
  commonConfig({
    circularDependencyIgnore: /node_modules|ui\/build/,
    deadCodeIgnore: [
      '**/README.md',
      '**/__mocks__/**/*',
      '**/*.unit.*',
      '**/*.it.*',
      '**/src/models/**/*',
      '**/src/store/types/**/*',
      '**/src/**/types.ts',
    ],
  }),
  (config) => ({
    plugins: [new webpack.IgnorePlugin({ resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/ })],

    resolveLoader: {
      modules: [resolvePath(config, '../../node_modules'), resolvePath(config, '../../node_modules/@voiceflow/webpack-config/node_modules')],
    },

    resolve: {
      fallback: {
        fs: false,
        path: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
      },
    },
  })
);
