/* eslint-disable no-process-env, import/no-extraneous-dependencies */
import { defineConfig } from 'cypress';
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

  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'cypress/results/test-report-[hash].xml',
  },
});
