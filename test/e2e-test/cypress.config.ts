/* eslint-disable @typescript-eslint/no-var-requires */
import { VoiceflowPlugin } from '@voiceflow/cypress-common/plugin';
import { Timeout } from '@voiceflow/test-common';
import { defineConfig } from 'cypress';
import cypressSplit from 'cypress-split';

const { verifyDownloadTasks } = require('cy-verify-downloads');
const { removeDirectory } = require('cypress-delete-downloads-folder');
const patchCypressOn = require('cypress-on-fix');

export default defineConfig({
  includeShadowDom: true,
  experimentalInteractiveRunEvents: true,
  video: true,
  videoCompression: 20,

  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'cypress/results/test-report-[hash].xml',
  },
  e2e: {
    defaultCommandTimeout: process.env.CI ? Timeout.LONG : Timeout.DEFAULT,
    specPattern: '**/*.spec.ts',
    setupNodeEvents(cypressOn, config) {
      const on = patchCypressOn(cypressOn);

      const voiceflowPlugin = new VoiceflowPlugin();

      voiceflowPlugin.use(on, config);
      on('task', {
        ...verifyDownloadTasks,
        ...voiceflowPlugin.tasks(),

        removeDirectory,
      });

      cypressSplit(on, config);

      return config;
    },
  },
});
