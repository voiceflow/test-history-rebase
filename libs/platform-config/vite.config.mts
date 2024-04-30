import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  build: {
    outDir: 'build/backend',
    lib: {
      entry: 'src/index.ts',
      name: 'platform-config-backend',
      fileName: 'index',
      formats: ['cjs', 'es'],
    },
  },

  plugins: [tsconfigPaths(), dts({ tsconfigPath: 'tsconfig.build.json', insertTypesEntry: true })],

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
