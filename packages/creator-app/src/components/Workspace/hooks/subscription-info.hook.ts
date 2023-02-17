import { BillingPeriod, PlanType } from '@voiceflow/internal';
import React from 'react';

import * as Payment from '@/contexts/PaymentContext';

export const useSubscriptionInfo = () => {
  const { planSubscription, isReady, plans } = Payment.usePaymentAPI();
  return React.useMemo(() => {
    if (!isReady) return {};

    if (planSubscription) return planSubscription;

    const plan = plans.find((plan) => plan.id === PlanType.PRO);

    if (!plan?.pricing) return {};

    return { unitPrice: plan.pricing[BillingPeriod.MONTHLY].price / 100, billingPeriod: BillingPeriod.MONTHLY };
  }, [planSubscription, isReady, plans]);
};
