/* eslint-disable no-process-env, import/no-extraneous-dependencies */

import globalsPolyfill from '@esbuild-plugins/node-globals-polyfill';
import replace from '@rollup/plugin-replace';
import reactRefresh from '@vitejs/plugin-react-refresh';
import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import banner from 'vite-plugin-banner';
import html from 'vite-plugin-html';
import reactSvg from 'vite-plugin-react-svg';

import { loadEnv } from './config/vite/env';
import { esbuildResolveFixup } from './config/vite/plugins';

// https://vitejs.dev/config/
const config = defineConfig(async ({ command }) => {
  const { ENV, ENV_TO_INJECT } = loadEnv();

  const isE2E = ENV.E2E === 'true';
  const sourceMapsEnabled = ENV.SOURCE_MAPS === 'true';

  const isServe = command === 'serve';

  return {
    build: {
      outDir: './build',
      minify: sourceMapsEnabled ? false : 'esbuild',
      sourcemap: sourceMapsEnabled,
      brotliSize: !isE2E,
      emptyOutDir: true,
    },

    base: path.resolve(__dirname, '/'),

    envPrefix: ['VF_APP', 'VF_OVERRIDE'],

    assetsInclude: ['csv'],

    plugins: [
      reactRefresh(),
      reactSvg({ svgo: true, defaultExport: 'component' }),
      banner(`Voiceflow ${ENV.VERSION}`),
      replace({ ...ENV_TO_INJECT, preventAssignment: true }),
      html({ inject: { data: ENV }, minify: true }),
    ],

    server: isServe
      ? {
          port: 3002,
          host: '0.0.0.0',
          https: {
            key: fs.readFileSync(path.join(__dirname, 'certs/localhost.key')),
            cert: fs.readFileSync(path.join(__dirname, 'certs/localhost.crt')),
          },
        }
      : undefined,

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '/src'),
        stream: 'stream-browserify',

        ...(command === 'serve'
          ? {
              '@voiceflow/ui': path.resolve(__dirname, '../ui/src'),
              '@voiceflow/realtime-sdk': path.resolve(__dirname, '../realtime-sdk/src'),
            }
          : {}),
      },
    },

    optimizeDeps: {
      include: ['crypto-js/aes.js'],

      esbuildOptions: {
        plugins: [
          esbuildResolveFixup({
            match: /react-virtualized/,
            resolvePath: '../../node_modules/react-virtualized/dist/umd/react-virtualized.js',
          }),
          esbuildResolveFixup({
            match: /idb-keyval/,
            resolvePath: '../../node_modules/idb-keyval/dist/index.js',
          }),
          globalsPolyfill({
            buffer: false,
            define: ENV_TO_INJECT,
            process: true,
          }),
        ],
      },
    },
  };
});

export default config;
