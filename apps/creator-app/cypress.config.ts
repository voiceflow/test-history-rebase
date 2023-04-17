/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'cypress';
import vitePreprocessor from 'cypress-vite';

export default defineConfig({
  projectId: '75gu5n',
  chromeWebSecurity: false,
  defaultCommandTimeout: 10000,
  e2e: {
    baseUrl: 'https://creator-app.test.e2e:3002',
    supportFile: 'cypress/support/index.ts',
    setupNodeEvents(on) {
      on('file:preprocessor', vitePreprocessor());
    },
  },
  component: {
    supportFile: 'cypress/support/index.ts',
    devServer: {
      bundler: 'vite',
      framework: 'react',
    },
  },
  retries: 1,
});
