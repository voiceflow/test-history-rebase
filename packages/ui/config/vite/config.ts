import defineConfig from '@voiceflow/vite-config';
import path from 'path';

const rootDir = process.cwd();

export default defineConfig({
  name: 'UI',
  rootDir,
  aliases: ({ isServe }) => ({
    ...(isServe ? { '@ui': path.resolve(rootDir, '../ui/src') } : {}),
  }),
})((config) => ({
  ...config,

  test: {
    ...config.test,
    setupFiles: 'config/test/setup.ts',
    coverage: {
      ...config.test?.coverage,
      reporter: ['html', 'text', 'text-summary', 'lcov'],
      reportsDirectory: 'coverage',
    },
  },
}));
