import React, { useContext } from 'react';

import { STEP_META, StepID } from '@/pages/Onboarding/constants';
import { OnboardingContext } from '@/pages/Onboarding/context';

import { Container, ProgressLine, Title } from './components';

const StepStatus: React.FC = () => {
  const { state } = useContext(OnboardingContext);
  const { numberOfSteps, currentStepID, stepStack, paymentMeta } = state;
  const titleMeta = currentStepID === StepID.PAYMENT ? paymentMeta.plan : undefined;

  return (
    <Container>
      <Title>{STEP_META[currentStepID].title(titleMeta)}</Title>
      {numberOfSteps > 1 && (
        <>
          {stepStack.map((type, index) => (type === StepID.WELCOME ? null : <ProgressLine active key={`filled-${index}`} />))}

          {Array.from({ length: numberOfSteps - stepStack.length }, (_, index) => (
            <ProgressLine key={`empty-${index}`} />
          ))}
        </>
      )}
    </Container>
  );
};

export default StepStatus;
