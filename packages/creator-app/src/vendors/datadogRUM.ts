import { datadogLogs } from '@datadog/browser-logs';
import { datadogRum, DefaultPrivacyLevel } from '@datadog/browser-rum';
import * as Realtime from '@voiceflow/realtime-sdk';

import { CLOUD_ENV, DATADOG_APP_ID, DATADOG_CLIENT_TOKEN, DATADOG_SITE, VERSION } from '@/config';

export const initialize = () => {
  datadogRum.init({
    applicationId: DATADOG_APP_ID,
    env: CLOUD_ENV,
    site: DATADOG_SITE,
    version: VERSION,
    service: 'creator-app',
    sampleRate: 100,
    clientToken: DATADOG_CLIENT_TOKEN,
    trackResources: true,
    trackLongTasks: true,
    trackInteractions: true,
    defaultPrivacyLevel: DefaultPrivacyLevel.ALLOW,
    sessionReplaySampleRate: 100,
    allowedTracingUrls: [
      'https://api.voiceflow.com',
      /https:\/\/api.*\.voiceflow\.com/,
      'https://identity-api.voiceflow.com',
      /https:\/\/identity-api.*\.voiceflow\.com/,
      'https://general-service.voiceflow.com',
      /https:\/\/general-service.*\.voiceflow\.com/,
      'https://general-runtime.voiceflow.com',
      /https:\/\/general-runtime.*\.voiceflow\.com/,
    ],
  });

  datadogLogs.init({
    site: DATADOG_SITE,
    version: VERSION,
    service: 'creator-app',
    sampleRate: 100,
    clientToken: DATADOG_CLIENT_TOKEN,
    forwardErrorsToLogs: true,
  });

  datadogRum.setGlobalContextProperty('realtime_subprotocol', Realtime.Subprotocol.CURRENT_VERSION);
  datadogLogs.setGlobalContextProperty('realtime_subprotocol', Realtime.Subprotocol.CURRENT_VERSION);

  datadogRum.startSessionReplayRecording();
};
