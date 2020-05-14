import React, { useContext } from 'react';

import { FlexCenter } from '@/components/Flex';
import { OnboardingContext } from '@/pages/Onboarding/context';
import { OnboardingProps } from '@/pages/Onboarding/types';
import { FadeLeftContainer } from '@/styles/animations';

import { STEP_COMPONENTS } from './constants';

const CurrentStep: React.FC<OnboardingProps> = (props) => {
  const { state } = useContext(OnboardingContext);
  const { currentStepID } = state;
  const [renderKey, forceRerender] = React.useState(1);

  const CurrentStepComponent = STEP_COMPONENTS[currentStepID]!;

  React.useEffect(() => {
    const newKey = renderKey + 1;
    forceRerender(newKey);
  }, [CurrentStepComponent]);

  return (
    <FlexCenter>
      <FadeLeftContainer key={renderKey}>
        <CurrentStepComponent {...props} />
      </FadeLeftContainer>
    </FlexCenter>
  );
};

export default CurrentStep;
