import defineConfig from '@voiceflow/vite-config';

const rootDir = process.cwd();

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const universalDefineConfig: typeof defineConfig = defineConfig.default ?? defineConfig;

export default universalDefineConfig({
  name: 'Realtime',
  rootDir,
})((config) => ({
  ...config,

  test: {
    ...config.test,
    dir: '.',
    include: ['src/**/*.test.ts', 'test/**/*.{unit,it}.ts'],
    setupFiles: 'config/test/setup.ts',
  },
}));
