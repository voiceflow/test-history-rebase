import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import defineConfig, { esbuildResolveFixup } from '@voiceflow-meta/vite-config';
import * as Vite from 'vite';
import rewriteAll from 'vite-plugin-rewrite-all';

import { loadEnv } from './env';

const rootDir = process.cwd();

export default Vite.defineConfig((args) => {
  const baseConfig = defineConfig({
    name: 'Creator',
    env: loadEnv(),
    rootDir,
    experimentalSWC: true,
    aliases: {
      stream: 'stream-browserify',
    },
    serve: {
      port: 3002,
      https: {
        key: 'certs/localhost.key',
        cert: 'certs/localhost.crt',
      },
    },
  })(args);

  return Vite.mergeConfig(baseConfig, {
    plugins: [...(baseConfig.plugins ?? []), vanillaExtractPlugin(), rewriteAll()],

    optimizeDeps: {
      include: ['crypto-js/aes.js'],

      esbuildOptions: {
        plugins: [
          ...(baseConfig.optimizeDeps?.esbuildOptions?.plugins || []),
          esbuildResolveFixup({
            match: /xmlhttprequest-ssl/,
            resolvePath: './config/vite/polyfills/XMLHttpRequest.js',
          }),
        ],
      },
    },
  });
});
