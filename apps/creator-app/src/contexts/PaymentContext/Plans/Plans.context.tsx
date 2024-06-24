import { BillingPeriodUnit, BillingPlan, PlanName } from '@voiceflow/dtos';
import { FeatureFlag } from '@voiceflow/realtime-sdk';
import { useAtomValue, useSetAtom } from 'jotai/react';
import React from 'react';

import { designerClient } from '@/client/designer';
import { useHttp } from '@/hooks';
import { useFeature } from '@/hooks/feature.hook';

import * as atoms from './Plans.atoms';
import { useCoupon } from './Plans.hooks';

type PlanPrice = BillingPlan['pricesByPeriodUnit'][BillingPeriodUnit];

interface PlansContext {
  fetch: () => Promise<any>;
  plans: BillingPlan[] | null;
  getPlanPrice: (id?: string, billingPeriodUnit?: BillingPeriodUnit) => PlanPrice | null;
  error: boolean;
  loading: boolean;
}

// use usePlans hook to access the plans
const PlansContext = React.createContext<PlansContext | null>(null);

export const PlansProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [couponID] = useCoupon();
  const teamsPlanSelfServeIsEnabled = useFeature(FeatureFlag.TEAMS_PLAN_SELF_SERVE);
  const setPlans = useSetAtom(atoms.plansAtom);
  const plansByID = useAtomValue(atoms.plansByIDAtom);

  const planIDs = teamsPlanSelfServeIsEnabled ? [PlanName.PRO, PlanName.TEAM] : [PlanName.PRO];

  const { data, error, loading, fetch } = useHttp(() =>
    designerClient.billing.plan.getPlans({
      planIDs,
      ...(couponID ? { coupons: [couponID] } : {}),
    })
  );

  React.useEffect(() => {
    if (data) setPlans(data);
  }, [setPlans, data]);

  const getPlan = (id?: string) => (id ? plansByID[id] : null);

  const getPlanPrice = (id?: string, billingPeriodUnit?: BillingPeriodUnit): PlanPrice | null =>
    billingPeriodUnit && id ? getPlan(id)?.pricesByPeriodUnit?.[billingPeriodUnit] ?? null : null;

  return (
    <PlansContext.Provider value={{ plans: data, error, loading, fetch, getPlanPrice }}>
      {children}
    </PlansContext.Provider>
  );
};

export const usePlans = () => {
  const context = React.useContext(PlansContext);

  if (!context) {
    throw new Error('usePlans must be used within a PlansProvider');
  }

  React.useEffect(() => {
    if (!context.plans && !context.loading) context.fetch();
  }, [context.plans, context.loading]);

  return context;
};
