import defineConfig from '@voiceflow/vite-config';
import path from 'path';

const rootDir = process.cwd();

export default defineConfig({
  name: 'Platform',
  rootDir,
  aliases: ({ isServe }) => ({
    ...(isServe ? { '@platform-config': path.resolve(rootDir, '../src') } : {}),
  }),
})((config) => ({
  ...config,

  test: {
    ...config.test,
    dir: './test',
    setupFiles: 'config/test/setup.ts',
    restoreMocks: true,
    coverage: {
      ...config.test?.coverage,
      reporter: ['html', 'text', 'text-summary', 'lcov'],
      reportsDirectory: 'coverage',
    },
  },
}));
