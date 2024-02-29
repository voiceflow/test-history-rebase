import { PlanType } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

export const ChargebeePlanType = {
  STARTER: PlanType.STARTER,
  PRO: PlanType.PRO,
  TEAM: PlanType.TEAM,
  ENTERPRISE: PlanType.ENTERPRISE,
} as const;

export type ChargebeePlanType = (typeof ChargebeePlanType)[keyof typeof ChargebeePlanType];

const chargebeePlanTypes = new Set(Object.values(ChargebeePlanType));

export const isChargebeePlanType = (plan: any): plan is ChargebeePlanType => chargebeePlanTypes.has(plan);

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
