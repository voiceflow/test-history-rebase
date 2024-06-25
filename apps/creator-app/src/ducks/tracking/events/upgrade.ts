import type { BillingPeriod, PlanType } from '@voiceflow/internal';

import client from '@/client';
import { PERIOD_NAME } from '@/constants';

import type { UpgradePrompt } from '../constants';
import { EventName } from '../constants';
import { createWorkspaceEvent, createWorkspaceEventTracker } from '../utils';

interface TrackUpgradeOptions {
  plan: PlanType;
  seats: number;
  period: BillingPeriod;
}

interface TrackSubscriptionModifiedOptions {
  id: string;
  action: 'upgrade' | 'downgrade';
  period: 'month' | 'year';
  newPlan: string;
  previousPlan: string;
}

export const trackUpgrade = createWorkspaceEventTracker<TrackUpgradeOptions>(({ period, ...eventInfo }) =>
  client.analytics.track(
    createWorkspaceEvent(EventName.SUBSCRIPTION_CREATED, { ...eventInfo, period: PERIOD_NAME[period].toLowerCase() })
  )
);

export const trackSubscriptionModified = createWorkspaceEventTracker<TrackSubscriptionModifiedOptions>(
  ({ newPlan, previousPlan, ...info }) =>
    client.analytics.track(
      createWorkspaceEvent(EventName.SUBSCRIPTION_MODIFIED, {
        ...info,
        new_plan: newPlan,
        previous_plan: previousPlan,
      })
    )
);

interface TrackUpgradePromptOptions {
  promptType: UpgradePrompt;
}

export const trackUpgradePrompt = createWorkspaceEventTracker<TrackUpgradePromptOptions>(
  ({ promptType, ...eventInfo }) =>
    client.analytics.track(createWorkspaceEvent(EventName.UPGRADE_PROMPT, { ...eventInfo, prompt_type: promptType }))
);

export const trackUpgradeModal = createWorkspaceEventTracker((eventInfo) =>
  client.analytics.track(createWorkspaceEvent(EventName.UPGRADE_MODAL, eventInfo))
);

export const trackContactSales = createWorkspaceEventTracker<TrackUpgradePromptOptions>(
  ({ promptType, ...eventInfo }) =>
    client.analytics.track(createWorkspaceEvent(EventName.CONTACT_SALES, { ...eventInfo, prompt_type: promptType }))
);
