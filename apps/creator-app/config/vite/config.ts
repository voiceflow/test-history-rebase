import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import defineConfig, { esbuildResolveFixup } from '@voiceflow/vite-config';
import path from 'path';

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
          '@voiceflow/platform-config/backend': path.resolve(rootDir, '../../libs/platform-config/src'),
          '@voiceflow/platform-config': path.resolve(rootDir, '../../libs/platform-config/src'),
          '@platform-config': path.resolve(rootDir, '../../libs/platform-config/src'),
        }
      : {}),
  }),
  serve: {
    port: 3000,
    https: {
      key: 'certs/localhost.key',
      cert: 'certs/localhost.crt',
    },
  },
})((config) => ({
  ...config,
  plugins: [...(config.plugins ?? []), vanillaExtractPlugin()],

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

    alias: {
      ...config.test?.alias,
      '@voiceflow/ui-next': path.resolve(rootDir, '../../node_modules/@voiceflow/ui-next/build/cjs/main.cjs'),
    },
  },
}));
