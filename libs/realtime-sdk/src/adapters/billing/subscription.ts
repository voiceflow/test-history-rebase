import { Identity } from '@realtime-sdk/models';
import type { SubscriptionDTO } from '@voiceflow/dtos';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';

const getDateWithoutTimezone = (date: Date) => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

const ONE_DAY = 1000 * 60 * 60 * 24;

function getDaysLeftToTrialEnd(trialEndDate: Date) {
  const trialEndDateWithoutTimezone = getDateWithoutTimezone(trialEndDate);
  const today = getDateWithoutTimezone(new Date());

  const daysLeft = Math.ceil((trialEndDateWithoutTimezone.getTime() - today.getTime()) / ONE_DAY);

  return Math.max(0, daysLeft);
}

const subscriptionAdapter = createMultiAdapter<Identity.Subscription, SubscriptionDTO>(
  ({ id, billingPeriodUnit, status, nextBillingAt, subscriptionItems }) => {
    const planItem = subscriptionItems?.find((item) => item.itemType === 'plan');
    const trialEnd = planItem?.trialEnd;

    const result: SubscriptionDTO = {
      id,
      billingPeriodUnit: billingPeriodUnit ?? null,
      editorSeats: planItem?.quantity ?? 0,
      plan: planItem?.itemPriceID ? planItem.itemPriceID.split('-')[0] : 'starter',
      nextBillingDate: nextBillingAt ? new Date(nextBillingAt).toJSON() : null,
      status,
      trial: trialEnd ? { daysLeft: getDaysLeftToTrialEnd(new Date(trialEnd)), endAt: new Date(trialEnd).toJSON() } : null,
    };

    return result;
  },
  notImplementedAdapter.transformer
);

export default subscriptionAdapter;
