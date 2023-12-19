import { datadogLogs } from '@datadog/browser-logs';
import { datadogRum, DefaultPrivacyLevel } from '@datadog/browser-rum';
import * as Realtime from '@voiceflow/realtime-sdk';
import { getCookieByName } from '@voiceflow/ui';

import { CLOUD_ENV, DATADOG_APP_ID, DATADOG_CLIENT_TOKEN, DATADOG_SITE, VERSION } from '@/config';

export const initialize = () => {
  if (getCookieByName('vf_dd_disable') === 'true') return;

  datadogRum.init({
    applicationId: DATADOG_APP_ID,
    env: CLOUD_ENV,
    site: DATADOG_SITE,
    version: VERSION,
    service: 'creator-app',
    clientToken: DATADOG_CLIENT_TOKEN,
    trackResources: true,
    trackLongTasks: true,
    traceSampleRate: 100,
    sessionSampleRate: 100,
    telemetrySampleRate: 100,
    trackUserInteractions: true,
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
    clientToken: DATADOG_CLIENT_TOKEN,
    sessionSampleRate: 100,
    telemetrySampleRate: 100,
    forwardErrorsToLogs: true,
  });

  datadogRum.setGlobalContextProperty('realtime_subprotocol', Realtime.Subprotocol.CURRENT_VERSION);
  datadogLogs.setGlobalContextProperty('realtime_subprotocol', Realtime.Subprotocol.CURRENT_VERSION);

  datadogRum.startSessionReplayRecording();
};
