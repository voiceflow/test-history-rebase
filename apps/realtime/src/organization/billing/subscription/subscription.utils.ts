import { SubscriptionPaymentMethodStatus, SubscriptionPaymentMethodStatusType } from '@voiceflow/dtos';
import { PlanType } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

export const ChargebeePlanType = {
  STARTER: PlanType.STARTER,
  PRO: PlanType.PRO,
  TEAM: PlanType.TEAM,
  ENTERPRISE: PlanType.ENTERPRISE,
} as const;

export const ChargebeeStatus = {
  FUTURE: 'future',
  IN_TRIAL: 'in_trial',
  ACTIVE: 'active',
  NON_RENEWING: 'non_renewing',
  PAUSED: 'paused',
  CANCELLED: 'cancelled',
  TRANSFERRED: 'transferred',
} as const;

export const ChargebeeBillingPeriodUnit = {
  MONTH: 'month',
  YEAR: 'year',
} as const;

const PAYMENT_METHOD_FAILED_STATUSES: Set<Partial<SubscriptionPaymentMethodStatusType>> = new Set([
  SubscriptionPaymentMethodStatus.EXPIRED,
  SubscriptionPaymentMethodStatus.INVALID,
  SubscriptionPaymentMethodStatus.EXPIRING,
]);

export type ChargebeePlanType = (typeof ChargebeePlanType)[keyof typeof ChargebeePlanType];

export type ChargebeeStatus = (typeof ChargebeeStatus)[keyof typeof ChargebeeStatus];

export type ChargebeeBillingPeriodUnit = (typeof ChargebeeBillingPeriodUnit)[keyof typeof ChargebeeBillingPeriodUnit];

const chargebeePlanTypes = new Set(Object.values(ChargebeePlanType));

export const isChargebeePlanType = (plan: any): plan is ChargebeePlanType => chargebeePlanTypes.has(plan);

export const isChargebeeStatus = (status: any): status is ChargebeeStatus => Object.values(ChargebeeStatus).includes(status);

export const isChargebeeBillingPeriodUnit = (unit: any): unit is ChargebeeBillingPeriodUnit =>
  Object.values(ChargebeeBillingPeriodUnit).includes(unit);
export const isPaymentMethodFailed = (status: SubscriptionPaymentMethodStatusType) => PAYMENT_METHOD_FAILED_STATUSES.has(status);

export function getDaysLeftToTrialEnd(trialEndDate: Date) {
  const trialEndDateWithoutTimezone = Realtime.Utils.date.removeTimezone(trialEndDate);
  const today = Realtime.Utils.date.removeTimezone(new Date());

  const daysLeft = Math.ceil((trialEndDateWithoutTimezone.getTime() - today.getTime()) / Realtime.Utils.date.ONE_DAY);

  return Math.max(0, daysLeft);
}

export const findPlanItem = (subscriptionItems?: Realtime.Identity.SubscriptionItem[] | undefined) => {
  return subscriptionItems?.find((item) => item.itemType === 'plan');
};

export const getPlanFromPriceID = (priceID: string | undefined) => {
  const [plan] = priceID?.split('-') ?? [];

  if (isChargebeePlanType(plan)) return plan;

  return ChargebeePlanType.STARTER;
};

export const getStatus = (status: string | undefined) => {
  if (isChargebeeStatus(status)) return status;

  return ChargebeeStatus.CANCELLED;
};

export const getBillingPeriodUnit = (unit: string | undefined) => {
  if (isChargebeeBillingPeriodUnit(unit)) return unit;

  return ChargebeeBillingPeriodUnit.MONTH;
};

export const isChargebeeTrial = (planItem: Realtime.Identity.SubscriptionItem | undefined, metaData: Record<string, unknown> | undefined) => {
  return planItem?.itemPriceID.includes('trial') || metaData?.downgradedFromTrial;
};

export const findBooleanEntitlement = (entitlements: Realtime.Identity.SubscriptionEntitlement[] | undefined, itemID: string) => {
  const entitlement = entitlements?.find((entitlement) => entitlement.featureID === itemID);

  if (!entitlement?.value) return null;

  return entitlement?.value === 'true';
};

export const findNumberEntitlement = (entitlements: Realtime.Identity.SubscriptionEntitlement[] | undefined, itemID: string) => {
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
