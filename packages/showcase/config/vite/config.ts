import defineConfig from '@voiceflow/vite-config';
import path from 'path';

const UI_PROJECT_URL = 'https://github.com/voiceflow/creator-app/tree/master/packages/ui';

const rootDir = process.cwd();
const uiProjectDir = path.resolve(rootDir, '../ui');

export default defineConfig({
  name: 'Showcase',
  env: {
    UI_PROJECT_DIR: process.env.NODE_ENV === 'production' ? UI_PROJECT_URL : `vscode://file/${uiProjectDir}`,
  },
  rootDir,
  serve: {
    port: 3005,
  },
})();
