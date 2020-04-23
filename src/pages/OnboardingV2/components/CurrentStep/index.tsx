import React, { useContext } from 'react';

import { FlexCenter } from '@/components/Flex';
import { STEP_META } from '@/pages/OnboardingV2/constants';
import { OnboardingContext } from '@/pages/OnboardingV2/context';
import { OnboardingProps } from '@/pages/OnboardingV2/types';
import { FadeLeftContainer } from '@/styles/animations';

const CurrentStep: React.FC<OnboardingProps> = (props) => {
  const { state } = useContext(OnboardingContext);
  const { currentStepID } = state;
  const [renderKey, forceRerender] = React.useState(1);

  const CurrentStepComponent = STEP_META[currentStepID].component!;

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
