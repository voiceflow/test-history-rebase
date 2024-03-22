import { BillingPeriod } from '@voiceflow/internal';
import { useAtom } from 'jotai';

import * as atoms from '../Payment.atoms';
import { Step } from '../Payment.constants';
import { usePricing } from './pricing';

export const usePaymentSteps = () => {
  const [activeStep, setActiveStep] = useAtom(atoms.stepAtom);
  const { onChangePeriod } = usePricing();

  const onNext = () => (activeStep === Step.PLAN ? setActiveStep(Step.BILLING) : setActiveStep(Step.PAYMENT));

  const onBack = () => {
    if (activeStep === Step.BILLING) {
      onChangePeriod(BillingPeriod.MONTHLY);
    }

    setActiveStep(activeStep === Step.BILLING ? Step.PLAN : Step.BILLING);
  };

  const onReset = () => setActiveStep(Step.PLAN);

  return {
    activeStep,
    onReset,
    onNext,
    onBack,
  };
};
