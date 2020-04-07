import React, { useContext } from 'react';

import { FlexCenter } from '@/components/Flex';
import { STEP_META } from '@/pages/OnboardingV2/constants';
import { OnboardingContext } from '@/pages/OnboardingV2/context';

const CurrentStep: React.FC = () => {
  const { state } = useContext(OnboardingContext);
  const { currentStepID } = state;

  const CurrentStepComponent = STEP_META[currentStepID].component!;

  return (
    <FlexCenter>
      <CurrentStepComponent />
    </FlexCenter>
  );
};

export default CurrentStep;
