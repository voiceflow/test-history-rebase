import { PlanType } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { PLAN_INFO } from '@voiceflow/schema-types';

<<<<<<< HEAD
export const isPlanType = (plan: string): plan is PlanType => Object.values(PlanType).find((type) => type === plan) !== undefined;
=======
export const isPlanType = (plan: any): plan is PlanType => plan in PlanType;
>>>>>>> master

export const getWorkspaceSeatsLimits = (plan: PlanType) => {
  const platInfo = PLAN_INFO[plan];

  return {
    editor: platInfo.editorLimit,
    viewer: platInfo.viewerLimit,
  };
};

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
  const [parsedPlan] = priceID?.split('-') ?? [];

  if (isPlanType(parsedPlan)) return parsedPlan as PlanType;

  // FIXME: temporary fix for the plan type, this value comes from chargebee, and it's not consistent with the plan type
  // eslint-disable-next-line no-secrets/no-secrets
  // https://voiceflowhq.slack.com/archives/C05H14G77D5/p1707166175310379
  if (parsedPlan === 'teams') return PlanType.TEAM;

  return PlanType.STARTER;
};

export const isChargebeeTrial = (planItem: Realtime.Identity.SubscriptionItem | undefined, metaData: Record<string, unknown> | undefined) => {
  return planItem?.itemPriceID.includes('trial') || metaData?.downgradedFromTrial;
};

export const findSwitchEntitlement = (entitlements: Realtime.Identity.SubscriptionEntitlement[] | undefined, itemID: string) => {
  const entitlement = entitlements?.find((entitlement) => entitlement.featureID === itemID);

  if (!entitlement?.value) return null;

  return entitlement?.value === 'true';
};

export const findRangeEntitlement = (entitlements: Realtime.Identity.SubscriptionEntitlement[] | undefined, itemID: string) => {
  const entitlement = entitlements?.find((entitlement) => entitlement.featureID === itemID);

  if (!entitlement?.value) return null;

  return entitlement?.value === 'Unlimited' ? Number.MAX_SAFE_INTEGER : Number(entitlement.value);
};
