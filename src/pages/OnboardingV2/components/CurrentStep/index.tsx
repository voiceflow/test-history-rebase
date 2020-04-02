import React from 'react';

import { FlexCenter } from '@/components/Flex';
import { STEP_META } from '@/pages/OnboardingV2/constants';
import { OnboardingContextProps, withOnboarding } from '@/pages/OnboardingV2/context';

const CurrentStep: React.FC<OnboardingContextProps> = ({
  onboarding: {
    state: { currentStepID },
  },
}) => {
  const CurrentStepComponent = STEP_META[currentStepID].component!;

  return (
    <FlexCenter>
      <CurrentStepComponent />
    </FlexCenter>
  );
};

export default withOnboarding(CurrentStep);
