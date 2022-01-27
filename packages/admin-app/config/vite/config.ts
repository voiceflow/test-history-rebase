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
          '@ui': path.resolve(rootDir, '../ui/src'),
          '@voiceflow/realtime-sdk': path.resolve(rootDir, '../realtime-sdk/src'),
          '@realtime-sdk': path.resolve(rootDir, '../realtime-sdk/src'),
        }
      : {
          '@ui': '@voiceflow/ui',
          '@realtime-sdk': '@voiceflow/realtime-sdk',
        }),
  }),
  serve: {
    port: 3003,
    https: {
      key: 'certs/localhost.key',
      cert: 'certs/localhost.crt',
    },
  },
})();
