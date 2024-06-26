import type { BillingPeriodUnit, PlanName } from '@voiceflow/dtos';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import * as atoms from '../Payment.atoms';

export const usePricing = () => {
  const [selectedPeriod, setSelectedPeriod] = useAtom(atoms.selectedPeriodAtom);
  const setSelectedPlanID = useSetAtom(atoms.selectedPlanIDAtom);
  const selectedPlan = useAtomValue(atoms.selectedPlanAtom);
  const selectedPlanPrice = useAtomValue(atoms.selectedPlanPriceAtom);
  const onChangePeriod = (period: BillingPeriodUnit) => setSelectedPeriod(period);
  const onChangePlan = (planID: PlanName) => setSelectedPlanID(planID);

  return {
    selectedPeriod,
    selectedPlan,
    selectedPlanPrice,
    hasCard: false,
    onChangePeriod,
    onChangePlan,
  };
};
