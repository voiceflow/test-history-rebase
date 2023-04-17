import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const rootDir = process.cwd();

export default defineConfig({
  resolve: {
    alias: [{ find: '@platform-config', replacement: path.resolve(rootDir, 'src') }],
  },
  build: {
    outDir: path.resolve(rootDir, 'build', 'backend'),
    lib: {
      entry: path.resolve(rootDir, 'src', 'index.ts'),
      name: 'platform-config-backend',
      fileName: 'index',
      formats: ['cjs', 'es'],
    },
  },
  plugins: [dts({ tsConfigFilePath: path.resolve(rootDir, 'tsconfig.build.json'), insertTypesEntry: true })],

  ssr: {
    noExternal: [
      'styled-components',
      '@emotion/*',
      'moize',
      'react-dismissable-layers',
      'react-dropzone',
      'micro-memoize',
      'micro-memoize/*',
      'react-input-autosize',
    ],
  },
});
