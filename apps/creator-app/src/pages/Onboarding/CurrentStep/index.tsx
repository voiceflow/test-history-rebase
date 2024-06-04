import { Animations, FlexCenter } from '@voiceflow/ui';
import React from 'react';

import { useOnboardingContext } from '@/pages/Onboarding/context';

import { StepID } from '../stepID.enum';
import { STEP_COMPONENTS } from './constants';

const CurrentStep: React.FC = () => {
  const { getCurrentStepID } = useOnboardingContext();
  const currentStepID = getCurrentStepID();

  const CurrentStepComponent = STEP_COMPONENTS[currentStepID];
  const AnimationContainer = currentStepID === StepID.WELCOME ? React.Fragment : Animations.FadeLeft;

  return (
    <FlexCenter key={currentStepID}>
      <AnimationContainer>
        <CurrentStepComponent />
      </AnimationContainer>
    </FlexCenter>
  );
};

export default CurrentStep;
