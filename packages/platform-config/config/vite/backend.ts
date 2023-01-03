import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const rootDir = process.cwd();

export default defineConfig({
  resolve: {
    alias: {
      '@platform-config': path.resolve(rootDir, 'src'),
    },
  },
  build: {
    outDir: path.resolve(rootDir, 'build', 'backend'),
    lib: {
      entry: path.resolve(rootDir, 'src', 'index.ts'),
      name: 'platform-config-backend',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'cjs'],
    },
  },
  plugins: [dts({ tsConfigFilePath: path.resolve(rootDir, 'tsconfig.backend.json') })],
});
