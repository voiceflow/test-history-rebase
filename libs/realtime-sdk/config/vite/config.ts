import defineConfig from '@voiceflow/vite-config';
import path from 'path';

const rootDir = process.cwd();

export default defineConfig({
  name: 'RealtimeSDK',
  rootDir,
  rootAlias: 'realtime-sdk',
  aliases: {
    '@test': path.resolve(rootDir, './test/__support__'),
    '@voiceflow/ui': path.resolve(rootDir, '../ui/build/module'),
    '@voiceflow/platform-config': path.resolve(rootDir, '../platform-config/build/backend'),
  },
})((config) => ({
  ...config,

  test: {
    ...config.test,
    dir: './test',
  },
}));
