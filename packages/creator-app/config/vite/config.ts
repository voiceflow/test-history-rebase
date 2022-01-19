import defineConfig, { esbuildResolveFixup } from '@voiceflow/vite-config';
import path from 'path';

import { loadEnv } from './env';

const rootDir = process.cwd();

export default defineConfig({
  name: 'Creator',
  env: loadEnv(),
  rootDir,
  aliases: ({ isServe }) => ({
    stream: 'stream-browserify',

    ...(isServe
      ? {
          '@voiceflow/ui': path.resolve(rootDir, '../ui/src'),
          '@ui': path.resolve(rootDir, '../ui/src'),
          '@voiceflow/realtime-sdk': path.resolve(rootDir, '../realtime-sdk/src'),
          '@realtime-sdk': path.resolve(rootDir, '../realtime-sdk/src'),
          '@voiceflow/ml-sdk': path.resolve(rootDir, '../ml-sdk/src'),
          '@ml-sdk': path.resolve(rootDir, '../ml-sdk/src'),
        }
      : {
          '@ui': '@voiceflow/ui',
          '@realtime-sdk': '@voiceflow/realtime-sdk',
          '@ml-sdk': '@voiceflow/ml-sdk',
        }),
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

  optimizeDeps: {
    ...config.optimizeDeps,
    include: ['crypto-js/aes.js'],

    esbuildOptions: {
      plugins: [
        ...(config.optimizeDeps?.esbuildOptions?.plugins || []),
        esbuildResolveFixup({
          match: /react-virtualized/,
          resolvePath: '../../node_modules/react-virtualized/dist/umd/react-virtualized.js',
        }),
        esbuildResolveFixup({
          match: /idb-keyval/,
          resolvePath: '../../node_modules/idb-keyval/dist/index.js',
        }),
      ],
    },
  },
}));
