import { BillingPeriod } from '@voiceflow/internal';
import React from 'react';

import { ACTIVE_PAID_PLAN } from '@/constants';
import * as Payment from '@/contexts/PaymentContext';
import { PlanPricesContext } from '@/contexts/PlanPricesContext';

const DEFAULT_INFO = {
  unitPrice: null,
  billingPeriod: BillingPeriod.MONTHLY,
};

export const useSubscriptionInfo = () => {
  const planPrices = React.useContext(PlanPricesContext);
  const { planSubscription, isReady } = Payment.usePaymentAPI();

  return React.useMemo(() => {
    if (!isReady) return DEFAULT_INFO;

    if (planSubscription) return planSubscription;

    const plan = planPrices.map[ACTIVE_PAID_PLAN];

    if (!plan) return DEFAULT_INFO;

    return {
      unitPrice: plan[BillingPeriod.MONTHLY],
      billingPeriod: BillingPeriod.MONTHLY,
    };
  }, [planSubscription, isReady, planPrices.map]);
};
