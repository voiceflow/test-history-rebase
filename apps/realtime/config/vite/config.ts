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
          '@voiceflow/realtime-sdk/backend': path.resolve(rootDir, '../../libs/realtime-sdk/src'),
          '@realtime-sdk': path.resolve(rootDir, '../../libs/realtime-sdk/src'),
          '@voiceflow/socket-utils': path.resolve(rootDir, '../../libs/socket-utils/src'),
          '@socket-utils': path.resolve(rootDir, '../../libs/socket-utils/src'),
          '@voiceflow/ui': path.resolve(rootDir, '../../libs/ui/src'),
          '@ui': path.resolve(rootDir, '../../libs/ui/src'),
          '@voiceflow/platform-config/backend': path.resolve(rootDir, '../../libs/platform-config/src'),
          '@platform-config': path.resolve(rootDir, '../../libs/platform-config/src'),
        }
      : {
          '@voiceflow/ui': path.resolve(rootDir, '../../libs/ui/build/module'),
          '@voiceflow/realtime-sdk/backend': path.resolve(rootDir, '../../libs/realtime-sdk/build/module'),
          '@voiceflow/platform-config/backend': path.resolve(rootDir, '../../libs/platform-config/build/module'),
        },
})((config) => ({
  ...config,

  test: {
    ...config.test,
    dir: '.',
    include: ['src/**/*.test.ts', 'test/**/*.{unit,it}.ts'],
    setupFiles: 'config/test/setup.ts',
  },
}));
