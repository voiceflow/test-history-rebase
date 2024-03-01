import { useAtom } from 'jotai';

import * as atoms from '../Payment.atoms';
import { Step } from '../Payment.constants';

export const usePaymentSteps = () => {
  const [activeStep, setActiveStep] = useAtom(atoms.stepAtom);

  const onNext = () => (activeStep === Step.PLAN ? setActiveStep(Step.BILLING) : setActiveStep(Step.PAYMENT));
  const onBack = () => setActiveStep(activeStep === Step.BILLING ? Step.PLAN : Step.BILLING);
  const onReset = () => setActiveStep(Step.PLAN);

  return {
    activeStep,
    onReset,
    onNext,
    onBack,
  };
};
