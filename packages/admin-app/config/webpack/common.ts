import { extendConfig, resolvePath } from '@voiceflow/webpack-config';
import commonConfig from '@voiceflow/webpack-config/build/configs/common';
import webpack from 'webpack';

export default extendConfig(
  commonConfig({
    circularDependencyIgnore: /node_modules|ui\/build/,
    deadCodeIgnore: ['**/__mocks__/**/*', '**/*.md', '**/types.ts'],
  }),
  (config) => ({
    plugins: [
      new webpack.DefinePlugin({
        'process.env.VF_OVERRIDE_API_HOST': JSON.stringify(process.env.VF_OVERRIDE_API_HOST || ''),
      }),
    ],

    resolveLoader: {
      modules: [resolvePath(config, '../../node_modules'), resolvePath(config, '../../node_modules/@voiceflow/webpack-config/node_modules')],
    },

    resolve: {
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
      },
    },
  })
);
