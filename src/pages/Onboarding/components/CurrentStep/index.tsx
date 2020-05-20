import React, { useContext } from 'react';

import { FlexCenter } from '@/components/Flex';
import { OnboardingContext } from '@/pages/Onboarding/context';
import { OnboardingProps } from '@/pages/Onboarding/types';
import { FadeLeftContainer } from '@/styles/animations';

import { STEP_COMPONENTS } from './constants';

const CurrentStep: React.FC<OnboardingProps> = (props) => {
  const { state } = useContext(OnboardingContext);
  const { currentStepID } = state;

  const CurrentStepComponent = STEP_COMPONENTS[currentStepID]!;

  return (
    <FlexCenter key={currentStepID}>
      <FadeLeftContainer>
        <CurrentStepComponent {...props} />
      </FadeLeftContainer>
    </FlexCenter>
  );
};

export default CurrentStep;
