import defineConfig, { esbuildResolveFixup } from '@voiceflow/vite-config';
import path from 'path';
import rewriteAll from 'vite-plugin-rewrite-all';

import { loadEnv } from './env';

const rootDir = process.cwd();

export default defineConfig({
  name: 'Creator',
  env: loadEnv(),
  rootDir,
  experimentalSWC: true,
  aliases: ({ isServe }) => ({
    stream: 'stream-browserify',

    ...(isServe
      ? {
          '@voiceflow/ui': path.resolve(rootDir, '../../libs/ui/src'),
          '@ui': path.resolve(rootDir, '../../libs/ui/src'),
          '@voiceflow/realtime-sdk': path.resolve(rootDir, '../../libs/realtime-sdk/src'),
          '@realtime-sdk': path.resolve(rootDir, '../../libs/realtime-sdk/src'),
          '@voiceflow/platform-config': path.resolve(rootDir, '../../libs/platform-config/src'),
          '@platform-config': path.resolve(rootDir, '../../libs/platform-config/src'),
          '@voiceflow/ml-sdk': path.resolve(rootDir, '../../libs/ml-sdk/src'),
          '@ml-sdk': path.resolve(rootDir, '../../libs/ml-sdk/src'),
        }
      : {}),
  }),
  serve: {
    port: 3002,
    https: {
      key: 'certs/localhost.key',
      cert: 'certs/localhost.crt',
    },
  },
})((config) => ({
  ...config,
  plugins: [...(config.plugins ?? []), rewriteAll()],

  optimizeDeps: {
    ...config.optimizeDeps,
    include: ['crypto-js/aes.js'],

    esbuildOptions: {
      plugins: [
        ...(config.optimizeDeps?.esbuildOptions?.plugins || []),
        esbuildResolveFixup({
          match: /xmlhttprequest-ssl/,
          resolvePath: './config/vite/polyfills/XMLHttpRequest.js',
        }),
      ],
    },
  },

  test: {
    ...config.test,
    dir: './test',
    setupFiles: 'config/test/setup.ts',
  },
}));
