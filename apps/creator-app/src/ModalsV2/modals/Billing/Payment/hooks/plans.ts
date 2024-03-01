import { BillingPlan } from '@voiceflow/dtos';
import { useAtom } from 'jotai';

import { designerClient } from '@/client/designer';

import * as atoms from '../Payment.atoms';

export const usePlans = () => {
  const [plans, setPlans] = useAtom(atoms.plansAtom);

  const fetchPlans = async () => {
    const plans = (await designerClient.billing.plan.getAllPlans()) as BillingPlan[];
    setPlans(plans);
  };

  return { plans, fetchPlans };
};
