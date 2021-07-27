import { BillingPeriod, PlanType } from '@voiceflow/internal';

import client from '@/client';
import { PERIOD_NAME } from '@/constants';

import { EventName, UpgradePrompt } from '../constants';
import { createWorkspaceEventPayload, createWorkspaceEventTracker } from '../utils';

interface TrackUpgradeOptions {
  plan: PlanType;
  seats: number;
  period: BillingPeriod;
  coupon: string;
}

export const trackUpgrade = createWorkspaceEventTracker<TrackUpgradeOptions>((options) =>
  client.analytics.track(
    EventName.EXPORT_BUTTON_CLICK,
    createWorkspaceEventPayload(options, {
      plan: options.plan,
      seats: options.seats,
      period: PERIOD_NAME[options.period].toLowerCase(),
      coupon: options.coupon,
    })
  )
);

interface TrackUpgradePromptOptions {
  promptType: UpgradePrompt;
}

export const trackUpgradePrompt = createWorkspaceEventTracker<TrackUpgradePromptOptions>((options) =>
  client.analytics.track(
    EventName.UPGRADE_PROMPT,
    createWorkspaceEventPayload(options, {
      prompt_type: options.promptType,
    })
  )
);

export const trackUpgradeModal = createWorkspaceEventTracker((options) =>
  client.analytics.track(EventName.UPGRADE_MODAL, createWorkspaceEventPayload(options))
);
