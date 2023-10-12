/* eslint-disable no-process-env, import/no-extraneous-dependencies */
import { defineConfig } from 'cypress';
import sorryCypress from 'cypress-cloud/plugin';
import vitePreprocessor from 'cypress-vite';

const baseURL = process.env.CREATOR_APP_URL;

if (!baseURL) throw new Error('must set CREATOR_APP_URL environment variable');

export default defineConfig({
  projectId: '75gu5n',
  chromeWebSecurity: false,
  defaultCommandTimeout: 10000,
  e2e: {
    baseUrl: baseURL,
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

  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'cypress/results/test-report-[hash].xml',
  },

  // Temporarily disable video recording
  video: false,
  screenshotOnRunFailure: false,
});
