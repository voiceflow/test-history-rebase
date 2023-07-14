/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'cypress';
import sorryCypress from 'cypress-cloud/plugin';
import vitePreprocessor from 'cypress-vite';

export default defineConfig({
  projectId: '75gu5n',
  chromeWebSecurity: false,
  defaultCommandTimeout: 10000,
  e2e: {
    baseUrl: 'https://creator-app.test.e2e:3002',
    supportFile: 'cypress/support/index.ts',
    setupNodeEvents(on, config) {
      on('file:preprocessor', vitePreprocessor());
      return sorryCypress(on, config);
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
