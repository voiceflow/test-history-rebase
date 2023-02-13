import { datadogLogs } from '@datadog/browser-logs';
import { datadogRum } from '@datadog/browser-rum';
import * as Realtime from '@voiceflow/realtime-sdk';

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
    allowedTracingOrigins: [
      'https://api.voiceflow.com',
      /https:\/\/api.*\.voiceflow\.com/,
      'https://general-service.voiceflow.com',
      /https:\/\/general-service.*\.voiceflow\.com/,
      'https://general-runtime.voiceflow.com',
      /https:\/\/general-runtime.*\.voiceflow\.com/,
    ],
  });

  datadogLogs.init({
    clientToken: 'pubd54c024c3ce9f4333a328044b85c8154', // FIXME: refactor into env var
    site: 'datadoghq.com',
    forwardErrorsToLogs: true,
    version: VERSION,
    service: 'creator-app',
    sampleRate: 100,
  });

  datadogRum.setGlobalContextProperty('realtime_subprotocol', Realtime.Subprotocol.CURRENT_VERSION);
  datadogLogs.setGlobalContextProperty('realtime_subprotocol', Realtime.Subprotocol.CURRENT_VERSION);

  datadogRum.startSessionReplayRecording();
};
