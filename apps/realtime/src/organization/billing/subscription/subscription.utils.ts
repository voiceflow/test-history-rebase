import { PlanType } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { PLAN_INFO } from '@voiceflow/schema-types';

export const isPlanType = (plan: any): plan is PlanType => plan in PlanType;

export const getWorkspacePlanLimits = (plan: PlanType) => {
  const platInfo = PLAN_INFO[plan];

  return {
    seatLimits: {
      editor: platInfo.editorLimit,
      viewer: platInfo.viewerLimit,
    },
    variableStatesLimit: platInfo.variableStatesLimit,
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
  const [plan] = priceID?.split('-') ?? [];

  if (isPlanType(plan)) return plan;

  // FIXME: temporary fix for the plan type, this value comes from chargebee, and it's not consistent with the plan type
  // eslint-disable-next-line no-secrets/no-secrets
  // https://voiceflowhq.slack.com/archives/C05H14G77D5/p1707166175310379
  if (plan === 'teams') return PlanType.TEAM;

  return PlanType.STARTER;
};

export const isChargebeeTrial = (planItem: Realtime.Identity.SubscriptionItem | undefined, metaData: Record<string, unknown> | undefined) => {
  return planItem?.itemPriceID.includes('trial') || metaData?.downgradedFromTrial;
};
