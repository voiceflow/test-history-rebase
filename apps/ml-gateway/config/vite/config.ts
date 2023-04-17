import path from 'path';
import { defineConfig } from 'vite';

const rootDir = process.cwd();

export default defineConfig({
  root: rootDir,
  resolve: {
    alias: [
      { find: /@\/(.*)/, replacement: path.resolve(rootDir, '/src/$1') },
      { find: /@voiceflow\/ml-sdk/, replacement: path.resolve(rootDir, '../ml-sdk/src') },
      { find: /@ml-sdk\/(.*)/, replacement: path.resolve(rootDir, '../ml-sdk/src/$1') },
      { find: /@voiceflow\/socket-utils/, replacement: path.resolve(rootDir, '../socket-utils/src') },
      { find: /@socket-utils\/(.*)/, replacement: path.resolve(rootDir, '../socket-utils/src/$1') },
    ],
  },
});
