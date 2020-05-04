import React, { useContext } from 'react';

import { STEP_META } from '@/pages/OnboardingV2/constants';
import { OnboardingContext } from '@/pages/OnboardingV2/context';

import ActionButton from './components/ActionButton';
import Container from './components/Container';
import StepStatus from './components/StepStatus';

const OnboardingModalHeader: React.FC = () => {
  const { state, actions } = useContext(OnboardingContext);
  const { currentStepID, stepStack } = state;
  const { stepBack, stepForward } = actions;

  const currentStepMeta = STEP_META[currentStepID];
  const hasBackButton = currentStepMeta?.canBack && stepStack.length > 1;
  const hasSkipButton = currentStepMeta?.canSkip && !!currentStepMeta?.skipTo;

  return (
    <Container>
      <ActionButton shouldRender={hasBackButton} icon="back" onClick={stepBack} label="back" />
      <StepStatus />
      <ActionButton
        shouldRender={hasSkipButton}
        icon="next"
        label="skip"
        onClick={() => {
          stepForward(currentStepMeta?.skipTo);
        }}
      />
    </Container>
  );
};

export default OnboardingModalHeader;
