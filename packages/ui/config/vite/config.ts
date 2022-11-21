import defineConfig from '@voiceflow/vite-config';

const rootDir = process.cwd();

export default defineConfig({
  name: 'UI',
  rootDir,
  rootAlias: 'ui',
})((config) => ({
  ...config,

  test: {
    ...config.test,
    dir: './test',
    setupFiles: 'config/test/setup.ts',
  },
}));
