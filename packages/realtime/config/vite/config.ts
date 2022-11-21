import defineConfig from '@voiceflow/vite-config';
import path from 'path';

const rootDir = process.cwd();

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const universalDefineConfig: typeof defineConfig = defineConfig.default ?? defineConfig;

export default universalDefineConfig({
  name: 'Realtime',
  rootDir,
  aliases: ({ isServe }): Record<string, string> =>
    isServe
      ? {
          '@voiceflow/realtime-sdk': path.resolve(rootDir, '../realtime-sdk/src'),
          '@realtime-sdk': path.resolve(rootDir, '../realtime-sdk/src'),
          '@voiceflow/socket-utils': path.resolve(rootDir, '../socket-utils/src'),
          '@socket-utils': path.resolve(rootDir, '../socket-utils/src'),
          '@voiceflow/ui': path.resolve(rootDir, '../ui/src'),
          '@ui': path.resolve(rootDir, '../ui/src'),
          '@voiceflow/platform-config': path.resolve(rootDir, '../platform-config/src'),
          '@platform-config': path.resolve(rootDir, '../platform-config/src'),
        }
      : {
          '@voiceflow/ui': path.resolve(rootDir, '../ui/build/module'),
          '@voiceflow/platform-config': path.resolve(rootDir, '../platform-config/build/module'),
        },
})((config) => ({
  ...config,

  test: {
    ...config.test,
    dir: './test',
    setupFiles: 'config/test/setup.ts',
  },
}));
