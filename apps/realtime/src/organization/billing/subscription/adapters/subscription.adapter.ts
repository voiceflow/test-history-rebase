import type { Subscription } from '@voiceflow/dtos';
import { PlanType } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';

import { findPlanItem, getDaysLeftToTrialEnd, getPlanFromPriceID, getWorkspacePlanLimits, isChargebeeTrial } from '../subscription.utils';

const subscriptionAdapter = createMultiAdapter<Realtime.Identity.Subscription, Subscription>(
  ({ id, billingPeriodUnit, status, nextBillingAt, subscriptionItems, metaData, hasScheduledChanges }) => {
    const planItem = findPlanItem(subscriptionItems);
    const trialEnd = planItem?.trialEnd;

    const plan = getPlanFromPriceID(planItem?.itemPriceID);
    const isTrial = isChargebeeTrial(planItem, metaData);
    const planLimits = getWorkspacePlanLimits(plan as PlanType);

    const result: Subscription = {
      id,
      billingPeriodUnit: billingPeriodUnit ?? null,
      editorSeats: planItem?.quantity ?? 1,
      pricePerEditor: planItem?.unitPrice ? planItem.unitPrice / 100 : 0,
      plan: metaData?.downgradedFromTrial ? PlanType.PRO : plan,
      nextBillingDate: nextBillingAt ? Realtime.Utils.date.to_DD_MMM_YYYY(new Date(nextBillingAt)) : null,
      status,
      trial: isTrial && trialEnd ? { daysLeft: getDaysLeftToTrialEnd(new Date(trialEnd)), endAt: new Date(trialEnd).toJSON() } : null,
      planSeatLimits: planLimits.seatLimits,
      variableStatesLimit: planLimits.variableStatesLimit,
      hasScheduledChanges,
    };

    return result;
  },
  notImplementedAdapter.transformer
);

export default subscriptionAdapter;
