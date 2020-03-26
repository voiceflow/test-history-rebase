import React from 'react';

import { STEP_META } from '@/pages/OnboardingV2/constants';
import { OnboardingContextProps, withOnboarding } from '@/pages/OnboardingV2/context';

import ActionButton from './components/ActionButton';
import Container from './components/Container';
import StepStatus from './components/StepStatus';

const OnboardingModalHeader: React.FC<OnboardingContextProps> = ({
  onboarding: {
    state: { currentStepID, stepStack },
    actions: { stepBack, stepForward },
  },
}) => {
  const currentStepMeta = STEP_META[currentStepID];
  const hasBackButton = currentStepMeta.canBack && stepStack.length > 1;
  const hasSkipButton = currentStepMeta.canSkip && !!currentStepMeta.skipTo;
  return (
    <Container>
      <ActionButton shouldRender={hasBackButton} icon="back" onClick={stepBack} label="back" />
      <StepStatus />
      <ActionButton
        shouldRender={hasSkipButton}
        icon="next"
        label="skip"
        onClick={() => {
          stepForward(currentStepMeta.skipTo);
        }}
      />
    </Container>
  );
};

export default withOnboarding(OnboardingModalHeader);
