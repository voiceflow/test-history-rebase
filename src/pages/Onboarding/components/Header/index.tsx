import React, { useContext } from 'react';

import { STEP_META } from '@/pages/Onboarding/constants';
import { OnboardingContext } from '@/pages/Onboarding/context';

import { ActionButton, Container, StepStatus } from './components';

const OnboardingHeader: React.FC = () => {
  const { state, actions } = useContext(OnboardingContext);
  const { currentStepID, stepStack, justCreatingWorkspace } = state;
  const { stepBack, stepForward, onCancel } = actions;

  const currentStepMeta = STEP_META[currentStepID];
  const hasBackButton = currentStepMeta?.canBack && stepStack.length > 1;
  const hasSkipButton = currentStepMeta?.canSkip && !!currentStepMeta?.skipTo;

  return (
    <Container>
      <ActionButton shouldRender={hasBackButton} icon="back" onClick={stepBack} label="back" />
      <StepStatus />
      {justCreatingWorkspace ? (
        <ActionButton shouldRender={true} icon="close" label="cancel" onClick={onCancel} />
      ) : (
        <ActionButton
          shouldRender={hasSkipButton}
          icon="next"
          label="skip"
          onClick={() => {
            stepForward(currentStepMeta?.skipTo, { skip: true });
          }}
        />
      )}
    </Container>
  );
};

export default OnboardingHeader;
