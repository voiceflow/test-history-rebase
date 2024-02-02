import { Identity } from '@realtime-sdk/models';
import type { Subscription } from '@voiceflow/dtos';
import { PlanType } from '@voiceflow/internal';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';

const getDateWithoutTimezone = (date: Date) => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

const ONE_DAY = 1000 * 60 * 60 * 24;

function getDaysLeftToTrialEnd(trialEndDate: Date) {
  const trialEndDateWithoutTimezone = getDateWithoutTimezone(trialEndDate);
  const today = getDateWithoutTimezone(new Date());

  const daysLeft = Math.ceil((trialEndDateWithoutTimezone.getTime() - today.getTime()) / ONE_DAY);

  return Math.max(0, daysLeft);
}

const subscriptionAdapter = createMultiAdapter<Identity.Subscription, Subscription>(
  ({ id, billingPeriodUnit, status, nextBillingAt, subscriptionItems, metaData }) => {
    const planItem = subscriptionItems?.find((item) => item.itemType === 'plan');
    const trialEnd = planItem?.trialEnd;

    const plan = planItem?.itemPriceID ? planItem.itemPriceID.split('-')[0] : PlanType.STARTER;
    const isTrial = planItem?.itemPriceID?.includes('trial') || metaData?.downgraded;

    const result: Subscription = {
      id,
      billingPeriodUnit: billingPeriodUnit ?? null,
      editorSeats: planItem?.quantity ?? 0,
      plan: metaData?.downgraded ? PlanType.PRO : plan,
      nextBillingDate: nextBillingAt ? new Date(nextBillingAt).toJSON() : null,
      status,
      trial: isTrial && trialEnd ? { daysLeft: getDaysLeftToTrialEnd(new Date(trialEnd)), endAt: new Date(trialEnd).toJSON() } : null,
    };

    return result;
  },
  notImplementedAdapter.transformer
);

export default subscriptionAdapter;
