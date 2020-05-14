import React, { useContext } from 'react';

import { STEP_META } from '@/pages/Onboarding/constants';
import { OnboardingContext } from '@/pages/Onboarding/context';

import StepID from '../../../../StepIDs';
import Container from './components/Container';
import ProgressLine from './components/ProgressLine';
import Title from './components/Title';

const StepStatus: React.FC = () => {
  const { state } = useContext(OnboardingContext);
  const { numberOfSteps, currentStepID, stepStack, paymentMeta } = state;
  const titleMeta = currentStepID === StepID.PAYMENT ? paymentMeta.plan : undefined;

  return (
    <Container>
      <Title>{STEP_META[currentStepID].title(titleMeta)}</Title>
      {numberOfSteps > 1 && (
        <>
          {stepStack.map((_, index) => (
            <ProgressLine active key={`filled-${index}`} />
          ))}
          {Array.from({ length: numberOfSteps - stepStack.length }, (index) => (
            <ProgressLine key={`empty-${index}`} />
          ))}
        </>
      )}
    </Container>
  );
};

export default StepStatus;
