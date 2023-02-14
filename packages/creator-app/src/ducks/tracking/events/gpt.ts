import client from '@/client';

import { EventName } from '../constants';
import { createProjectEventPayload, createProjectEventTracker, createWorkspaceEventPayload, createWorkspaceEventTracker } from '../utils';

export const trackWorkspaceAIFeatureToggled = createWorkspaceEventTracker<{ enabled: boolean }>(({ enabled, ...options }) =>
  client.api.analytics.track(EventName.AI_FEATURE_TOGGLED, createWorkspaceEventPayload(options, { enabled, scope: 'workspace' }))
);

export const trackProjectGenerateAIFeatureToggled = createProjectEventTracker<{ enabled: boolean; flag: string }>(({ flag, enabled, ...options }) =>
  client.api.analytics.track(EventName.AI_FEATURE_TOGGLED, createProjectEventPayload(options, { flag, enabled, scope: 'project' }))
);

export const trackAIQuotaCheck = createProjectEventTracker<{ quota: number; consume: number }>(({ quota, consume, ...options }) =>
  client.api.analytics.track(EventName.AI_QUOTA_CHECK, createProjectEventPayload(options, { quota, consume }))
);

export const trackAIQuotaDepleted = createProjectEventTracker<{ quota: number }>(({ quota, ...options }) =>
  client.api.analytics.track(EventName.AI_QUOTA_DEPLETED, createProjectEventPayload(options, { quota }))
);

export const trackNonAINoMatchGenerate = createProjectEventTracker<{ quantity: number }>(({ quantity, ...options }) =>
  client.api.analytics.track(EventName.NON_AI_NO_MATCH_GENERATE, createProjectEventPayload(options, { quantity }))
);

export const trackAIResultJudgement = createProjectEventTracker<{
  decision: 'accept' | 'reject';
  modified: string[];
  original: string[];
  requestID: string;
}>(({ decision, modified, original, requestID, ...options }) =>
  client.api.analytics.track(EventName.AI_RESULT_JUDGEMENT, createProjectEventPayload(options, { decision, modified, original, requestID }))
);

export const trackGenerateNoMatchDisclaimerAccepted = createProjectEventTracker((options) =>
  client.api.analytics.track(EventName.GENERATE_NO_MATCH_DISCLAIMER_ACCEPTED, createProjectEventPayload(options, { scope: 'project' }))
);

export const trackGenerateStepDisclaimerAccepted = createProjectEventTracker((options) =>
  client.api.analytics.track(EventName.GENERATE_STEP_DISCLAIMER_ACCEPTED, createProjectEventPayload(options, { scope: 'project' }))
);
