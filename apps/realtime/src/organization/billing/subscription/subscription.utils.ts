import type { SubscriptionPaymentMethodStatusType } from '@voiceflow/dtos';
import { BillingPeriodUnit, PlanName, SubscriptionPaymentMethodStatus, SubscriptionStatus } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

export const PAYMENT_METHOD_FAILED_STATUSES: Set<Partial<SubscriptionPaymentMethodStatusType>> = new Set([
  SubscriptionPaymentMethodStatus.EXPIRED,
  SubscriptionPaymentMethodStatus.INVALID,
  SubscriptionPaymentMethodStatus.EXPIRING,
]);

export const isChargebeePlanName = (plan: any): plan is PlanName => Object.values(PlanName).includes(plan);
export const isChargebeeStatus = (status: any): status is SubscriptionStatus =>
  Object.values(SubscriptionStatus).includes(status);
export const isChargebeeBillingPeriodUnit = (unit: any): unit is BillingPeriodUnit =>
  Object.values(BillingPeriodUnit).includes(unit);
export const isPaymentMethodFailed = (status: SubscriptionPaymentMethodStatusType) =>
  PAYMENT_METHOD_FAILED_STATUSES.has(status);

export function getDaysLeftToTrialEnd(trialEndDate: number, downgradedFromTrial?: boolean) {
  if (downgradedFromTrial) return 0;

  const today = new Date().getTime();

  const daysLeft = Math.ceil((trialEndDate - today) / Realtime.Utils.date.ONE_DAY);

  // should never be expired, since downgradedFromTrial is false at this point.
  const minDaysLeft = 1;

  return Math.max(minDaysLeft, daysLeft);
}

export const findPlanItem = (subscriptionItems?: Realtime.Identity.SubscriptionItem[] | undefined) => {
  return subscriptionItems?.find((item) => item.itemType === 'plan');
};

export const findPlanAddons = (subscriptionItems?: Realtime.Identity.SubscriptionItem[] | undefined) => {
  return subscriptionItems?.filter((item) => item.itemType === 'addon') ?? [];
};

export const getPlanFromPriceID = (priceID: string | undefined) => {
  const [plan] = priceID?.split('-') ?? [];

  if (isChargebeePlanName(plan)) return plan;

  return PlanName.STARTER;
};

export const getStatus = (status: string | undefined) => {
  if (isChargebeeStatus(status)) return status;

  return SubscriptionStatus.CANCELLED;
};

export const getBillingPeriodUnit = (unit: string | undefined) => {
  if (isChargebeeBillingPeriodUnit(unit)) return unit;

  return BillingPeriodUnit.MONTH;
};

export const isChargebeeTrial = (
  status: string,
  downgradedFromTrial: boolean,
  trialEndAt: number | undefined,
  cancelledAt: number | undefined
) => {
  const cancelledByTrialExpiration =
    status === SubscriptionStatus.CANCELLED && cancelledAt && cancelledAt === trialEndAt;

  return status === SubscriptionStatus.IN_TRIAL || downgradedFromTrial || cancelledByTrialExpiration;
};

export const findBooleanEntitlement = (
  entitlements: Realtime.Identity.SubscriptionEntitlement[] | undefined,
  itemID: string
) => {
  const entitlement = entitlements?.find((entitlement) => entitlement.featureID === itemID);

  if (!entitlement?.value) return null;

  return entitlement?.value === 'true';
};

export const findNumberEntitlement = (
  entitlements: Realtime.Identity.SubscriptionEntitlement[] | undefined,
  itemID: string
) => {
  const entitlement = entitlements?.find((entitlement) => entitlement.featureID === itemID);

  if (!entitlement?.value) return null;

  return entitlement?.value === 'Unlimited' ? Number.MAX_SAFE_INTEGER : Number(entitlement.value);
};

export const pollWithProgressiveTimeout = (
  checkCondition: () => Promise<boolean>,
  initialDelay: number,
  maxDelay: number,
  increaseFactor: number,
  dampening = 0.95
): Promise<void> =>
  new Promise<void>((resolve, reject) => {
    let currentDelay = initialDelay;

    const poll = () => {
      checkCondition()
        .then((conditionMet) => {
          // eslint-disable-next-line promise/always-return
          if (conditionMet) {
            resolve();
          } else {
            setTimeout(() => {
              currentDelay = Math.min(currentDelay + currentDelay * increaseFactor * dampening, maxDelay);
              // eslint-disable-next-line no-param-reassign
              dampening *= dampening;
              poll();
            }, currentDelay);
          }
        })
        .catch((error) => {
          reject(error);
        });
    };

    poll();
  });

export const AdditionalSeatAddon = {
  [BillingPeriodUnit.MONTH]: 'addon-additional-seats-monthly',
  [BillingPeriodUnit.YEAR]: 'addon-additional-seats-yearly',
};

export const getAdditionalSeatAddonPriceID = (unit: BillingPeriodUnit) => AdditionalSeatAddon[unit];
