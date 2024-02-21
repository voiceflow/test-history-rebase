import client from '@/client';

import { EventName } from '../constants';
import { createProjectEvent, createProjectEventTracker } from '../utils';

export const trackAIQuotaCheck = createProjectEventTracker<{ quota: number; consume: number }>((eventInfo) =>
  client.analytics.track(createProjectEvent(EventName.AI_QUOTA_CHECK, eventInfo))
);

export const trackAIQuotaDepleted = createProjectEventTracker<{ quota: number }>((eventInfo) =>
  client.analytics.track(createProjectEvent(EventName.AI_QUOTA_DEPLETED, eventInfo))
);

export const trackNonAINoMatchGenerate = createProjectEventTracker<{ quantity: number }>(({ quantity, ...eventInfo }) =>
  client.analytics.track(createProjectEvent(EventName.NON_AI_NO_MATCH_GENERATE, eventInfo))
);

export const trackAIResultJudgement = createProjectEventTracker<{
  decision: 'accept' | 'reject';
  modified: string[];
  original: string[];
  requestID: string;
}>(({ requestID, ...eventInfo }) =>
  client.analytics.track(createProjectEvent(EventName.AI_RESULT_JUDGEMENT, { ...eventInfo, request_id: requestID }))
);
