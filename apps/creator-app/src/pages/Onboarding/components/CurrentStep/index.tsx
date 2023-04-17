import { FlexCenter } from '@voiceflow/ui';
import React, { useContext } from 'react';

import { StepID } from '@/pages/Onboarding/constants';
import { OnboardingContext } from '@/pages/Onboarding/context';
import { OnboardingStepProps } from '@/pages/Onboarding/types';
import { FadeLeftContainer } from '@/styles/animations';

import { STEP_COMPONENTS } from './constants';

const CurrentStep: React.FC<OnboardingStepProps> = (props) => {
  const { state } = useContext(OnboardingContext);
  const { currentStepID } = state;

  const CurrentStepComponent = STEP_COMPONENTS[currentStepID]!;
  const AnimationContainer = currentStepID === StepID.WELCOME ? React.Fragment : FadeLeftContainer;

  return (
    <FlexCenter key={currentStepID}>
      <AnimationContainer>
        <CurrentStepComponent {...props} />
      </AnimationContainer>
    </FlexCenter>
  );
};

export default CurrentStep;
