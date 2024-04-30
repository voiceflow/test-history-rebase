import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  resolve: {
    mainFields: ['module', 'jsnext:main', 'jsnext'],
    preserveSymlinks: false,
  },

  build: {
    outDir: 'build/backend',

    lib: {
      entry: 'src/index.ts',
      name: 'realtime-sdk-backend',
      fileName: 'index',
      formats: ['cjs', 'es'],
    },
  },

  plugins: [tsconfigPaths(), dts({ tsconfigPath: 'tsconfig.build.json', insertTypesEntry: true })],

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
