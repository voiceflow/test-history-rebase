import { BrowserAnalyticsClient } from '@voiceflow/sdk-analytics';

import { ANALYTICS_API_ENDPOINT } from '@/config';

const analyticsClient = new BrowserAnalyticsClient({
  baseURL: ANALYTICS_API_ENDPOINT,
  fetchPonyfill: fetch.bind(window),
});

export default analyticsClient;
