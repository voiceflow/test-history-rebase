import { BillingPeriodUnit, BillingPlan } from '@voiceflow/dtos';
import { PlanType } from '@voiceflow/internal';
import { FeatureFlag } from '@voiceflow/realtime-sdk';
import { useAtom, useAtomValue } from 'jotai/react';

import { designerClient } from '@/client/designer';
import { useFeature } from '@/hooks/feature.hook';

import * as atoms from '../Payment.atoms';

export const usePlans = (coupon?: string) => {
  const teamsPlanSelfServeIsEnabled = useFeature(FeatureFlag.TEAMS_PLAN_SELF_SERVE);
  const [plans, setPlans] = useAtom(atoms.plansAtom);
  const plansByID = useAtomValue(atoms.plansByIDAtom);

  const fetchPlans = async () => {
    const plans = await designerClient.billing.plan.getPlans({
      planIDs: teamsPlanSelfServeIsEnabled ? [PlanType.PRO, PlanType.TEAM] : [PlanType.PRO],
      coupons: coupon ? [coupon] : undefined,
    });
    setPlans(plans as BillingPlan[]);
  };

  const getPlan = (id?: string) => (id ? plansByID[id] : null);

  const getPlanPrice = (id?: string, billingPeriodUnit?: BillingPeriodUnit) =>
    billingPeriodUnit && id ? getPlan(id)?.pricesByPeriodUnit?.[billingPeriodUnit] ?? null : null;

  return { plans, fetchPlans, getPlan, plansByID, getPlanPrice };
};
