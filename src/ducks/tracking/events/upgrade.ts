import client from '@/client';
import { BillingPeriod, PERIOD_NAME, PlanType } from '@/constants';

import { EventName } from '../constants';
import { createWorkspaceEventPayload, createWorkspaceEventTracker } from '../utils';

type TrackUpgradeOptions = {
  plan: PlanType;
  seats: number;
  period: BillingPeriod;
  coupon: string;
};

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
