import replace from '@rollup/plugin-replace';
import react from '@vitejs/plugin-react';
import reactSWC from '@vitejs/plugin-react-swc';
import fs from 'fs';
import path from 'path';
import type { UserConfig } from 'vite';
import { defineConfig } from 'vite';
import banner from 'vite-plugin-banner';
import { createHtmlPlugin } from 'vite-plugin-html';

import { DEFAULT_PORT, ENV_PREFIXES } from './constants';
import { reactSvg, ReactSvgExportType } from './plugins';
import type { Options } from './types';

export * from './constants';
export * from './env';
export * from './plugins';
export * from './types';

export default ({
  name,
  rootAlias = '',
  sourcemap,
  env: _env,
  aliases,
  rootDir: _rootDir,
  serve,
  experimentalSWC,
}: Options) =>
  defineConfig(({ mode, command }): UserConfig => {
    const env = typeof _env === 'function' ? _env() : _env ?? {};
    const envToInject = Object.fromEntries(
      Object.entries(env).map(([key, value]) => [`process.env.${key}`, JSON.stringify(value)])
    );

    const isE2E = env.E2E === 'true';
    const isTest = mode === 'test';
    const isServe = command === 'serve';
    const rootDir = _rootDir ?? process.cwd();
    const sourcemapEnabled = sourcemap || env.SOURCE_MAPS === 'true';

    return {
      build: {
        outDir: './build',
        minify: sourcemapEnabled ? false : 'esbuild',
        sourcemap: sourcemapEnabled,
        emptyOutDir: true,
        reportCompressedSize: !isE2E,
      },

      base: path.resolve(rootDir, '/'),

      envPrefix: ENV_PREFIXES,

      assetsInclude: ['csv'],

      plugins: [
        experimentalSWC ? reactSWC() : react({ jsxRuntime: 'classic' }),
        reactSvg({ svgo: true, defaultExport: ReactSvgExportType.COMPONENT }),
        banner(`Voiceflow ${name} ${env.VERSION}`),
        replace({ ...envToInject, preventAssignment: true }),
        createHtmlPlugin({ inject: { data: env }, minify: true }),
      ],

      ...(isServe &&
        !isTest && {
          server: {
            port: serve?.port ?? DEFAULT_PORT,
            host: '0.0.0.0',
            https: serve?.https
              ? {
                  key: fs.readFileSync(path.join(rootDir, serve.https.key), 'utf8'),
                  cert: fs.readFileSync(path.join(rootDir, serve.https.cert), 'utf8'),
                }
              : undefined,
          },
        }),

      resolve: {
        alias: {
          [`@${rootAlias}`]: path.resolve(rootDir, '/src'),

          ...(typeof aliases === 'function' ? aliases({ isServe }) : aliases),
        },
      },
    };
  });
