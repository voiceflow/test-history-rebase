import { BillingPeriodUnit, BillingPlan } from '@voiceflow/dtos';
import { PlanType } from '@voiceflow/internal';
import { FeatureFlag } from '@voiceflow/realtime-sdk';
import { useAtomValue, useSetAtom } from 'jotai/react';
import React from 'react';

import { designerClient } from '@/client/designer';
import { useHttpQuery } from '@/hooks';
import { useFeature } from '@/hooks/feature.hook';

import * as atoms from './Plans.atoms';

type PlanPrice = BillingPlan['pricesByPeriodUnit'][BillingPeriodUnit];

interface PlansContext {
  plans: BillingPlan[] | null;
  getPlanPrice: (id?: string, billingPeriodUnit?: BillingPeriodUnit) => PlanPrice | null;
  error: boolean;
  loading: boolean;
}

// use usePlans hook to access the plans
const PlansContext = React.createContext<PlansContext | null>(null);

export const PlansProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const teamsPlanSelfServeIsEnabled = useFeature(FeatureFlag.TEAMS_PLAN_SELF_SERVE);
  const setPlans = useSetAtom(atoms.plansAtom);
  const plansByID = useAtomValue(atoms.plansByIDAtom);
  const coupons = useAtomValue(atoms.couponIDsAtom);

  const planIDs = teamsPlanSelfServeIsEnabled ? [PlanType.PRO, PlanType.TEAM] : [PlanType.PRO];

  const { data, error, loading } = useHttpQuery(designerClient.billing.plan.getPlans, {
    planIDs,
    coupon: coupons,
  });

  React.useEffect(() => {
    if (data) setPlans(data);
  }, [setPlans, data]);

  const getPlan = (id?: string) => (id ? plansByID[id] : null);

  const getPlanPrice = (id?: string, billingPeriodUnit?: BillingPeriodUnit): PlanPrice | null =>
    billingPeriodUnit && id ? getPlan(id)?.pricesByPeriodUnit?.[billingPeriodUnit] ?? null : null;

  return (
    <PlansContext.Provider value={{ plans: data, error, loading, getPlanPrice }}>{children}</PlansContext.Provider>
  );
};

export const usePlans = () => {
  const context = React.useContext(PlansContext);

  if (!context) {
    throw new Error('usePlans must be used within a PlansProvider');
  }

  return context;
};
