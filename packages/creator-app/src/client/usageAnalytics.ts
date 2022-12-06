import { UsageAnalyticsSDK } from '@voiceflow/sdk-usage-analytics';

import { ANALYTICS_API_ENDPOINT } from '@/config';
import { getAuthCookie } from '@/utils/cookies';

const usageAnalyticsClient = new UsageAnalyticsSDK({
  analyticsServiceURI: ANALYTICS_API_ENDPOINT,
  authorizationHeader: () => `Bearer ${getAuthCookie()}`,
});

export default usageAnalyticsClient;
