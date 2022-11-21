import { datadogRum } from '@datadog/browser-rum';

import { CLOUD_ENV, VERSION } from '@/config';

export const initialize = () => {
  datadogRum.init({
    applicationId: 'ef6859f3-2843-43c6-9abf-0157556ff84a', // FIXME: refactor into env var
    clientToken: 'pubd54c024c3ce9f4333a328044b85c8154', // FIXME: refactor into env var
    site: 'datadoghq.com',
    service: 'creator-app',
    env: CLOUD_ENV,
    version: VERSION,
    sampleRate: 100,
    sessionReplaySampleRate: 100,
    trackInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: 'allow',
  });

  datadogRum.startSessionReplayRecording();
};
