import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const rootDir = process.cwd();

export default defineConfig({
  resolve: {
    alias: [{ find: '@realtime-sdk', replacement: path.resolve(rootDir, 'src') }],
    mainFields: ['module', 'jsnext:main', 'jsnext', 'browser'],
    preserveSymlinks: false,
  },

  build: {
    outDir: path.resolve(rootDir, 'build', 'backend'),

    lib: {
      entry: path.resolve(rootDir, 'src', 'index.ts'),
      name: 'realtime-sdk-backend',
      fileName: 'index',
      formats: ['cjs', 'es'],
    },
  },

  plugins: [dts({ tsconfigPath: path.resolve(rootDir, 'tsconfig.build.json'), insertTypesEntry: true })],

  ssr: {
    external: ['@voiceflow/base-types'],
    noExternal: [
      'styled-components',
      '@emotion/*',
      'moize',
      'react-dismissable-layers',
      'react-dropzone',
      'micro-memoize',
      'micro-memoize/*',
      '@voiceflow/ui-next',
      'react-input-autosize',
    ],
  },
});
