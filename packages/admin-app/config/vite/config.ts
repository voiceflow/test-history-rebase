import defineConfig from '@voiceflow/vite-config';
import path from 'path';

import { loadEnv } from './env';

const rootDir = process.cwd();

export default defineConfig({
  name: 'Admin',
  env: loadEnv(),
  rootDir,
  aliases: ({ isServe }) => ({
    stream: 'stream-browserify',

    ...(isServe
      ? {
          '@voiceflow/ui': path.resolve(rootDir, '../ui/src'),
          '@voiceflow/realtime-sdk': path.resolve(rootDir, '../realtime-sdk/src'),
        }
      : {}),
  }),
  serve: {
    port: 3003,
    https: {
      key: 'certs/localhost.key',
      cert: 'certs/localhost.crt',
    },
  },
})();
