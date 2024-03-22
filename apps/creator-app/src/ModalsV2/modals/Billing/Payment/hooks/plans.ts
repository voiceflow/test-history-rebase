import { BillingPlan } from '@voiceflow/dtos';
import { useAtom } from 'jotai';

import { designerClient } from '@/client/designer';
import { ACTIVE_PAID_PLAN } from '@/constants';

import * as atoms from '../Payment.atoms';

export const usePlans = (coupon?: string) => {
  const [plans, setPlans] = useAtom(atoms.plansAtom);

  const fetchPlans = async () => {
    const plans = (await designerClient.billing.plan.getAllPlans(ACTIVE_PAID_PLAN, { query: { coupon } })) as BillingPlan[];
    setPlans(plans);
  };

  return { plans, fetchPlans };
};
