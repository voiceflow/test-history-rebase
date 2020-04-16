import { times } from 'lodash';
import React, { useContext } from 'react';

import { STEP_META, StepID } from '@/pages/OnboardingV2/constants';
import { OnboardingContext } from '@/pages/OnboardingV2/context';

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
      <>
        {stepStack.map((_, index) => (
          <ProgressLine active key={`filled-${index}`} />
        ))}
        {times(numberOfSteps - stepStack.length, (index) => (
          <ProgressLine key={`empty-${index}`} />
        ))}
      </>
    </Container>
  );
};

export default StepStatus;
