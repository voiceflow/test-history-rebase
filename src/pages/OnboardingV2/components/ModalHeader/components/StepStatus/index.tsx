import { times } from 'lodash';
import React from 'react';

import { STEP_META } from '@/pages/OnboardingV2/constants';
import { OnboardingContextProps, withOnboarding } from '@/pages/OnboardingV2/context';

import Container from './components/Container';
import ProgressLine from './components/ProgressLine';
import Title from './components/Title';

const StepStatus: React.FC<OnboardingContextProps> = ({
  onboarding: {
    state: { numberOfSteps, currentStepID, stepStack },
  },
}) => {
  return (
    <Container>
      <Title>{STEP_META[currentStepID].title}</Title>
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

export default withOnboarding(StepStatus);
