import { Identity } from '@realtime-sdk/models';
import { to_DD_MMM_YYYY } from '@realtime-sdk/utils/date';
import { findPlanItem, getDaysLeftToTrialEnd, getPlanFromPriceID, getWorkspacePlanLimits, isChargebeeTrial } from '@realtime-sdk/utils/subscription';
import type { Subscription } from '@voiceflow/dtos';
import { PlanType } from '@voiceflow/internal';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';

const subscriptionAdapter = createMultiAdapter<Identity.Subscription, Subscription>(
  ({ id, billingPeriodUnit, status, nextBillingAt, subscriptionItems, metaData }) => {
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
      nextBillingDate: nextBillingAt ? to_DD_MMM_YYYY(new Date(nextBillingAt)) : null,
      status,
      trial: isTrial && trialEnd ? { daysLeft: getDaysLeftToTrialEnd(new Date(trialEnd)), endAt: new Date(trialEnd).toJSON() } : null,
      planSeatLimits: planLimits.seatLimits,
      variableStatesLimit: planLimits.variableStatesLimit,
    };

    return result;
  },
  notImplementedAdapter.transformer
);

export default subscriptionAdapter;
