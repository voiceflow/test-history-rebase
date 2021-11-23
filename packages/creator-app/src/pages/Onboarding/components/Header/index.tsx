import React, { useContext } from 'react';

import CreationHeader from '@/components/CreationSteps/components/Header';
import { Container } from '@/components/CreationSteps/components/StepStatus/components';
import { STEP_META, StepID } from '@/pages/Onboarding/constants';
import { OnboardingContext } from '@/pages/Onboarding/context';

const OnboardingHeader: React.FC = () => {
  const { state, actions } = useContext(OnboardingContext);
  const { numberOfSteps, currentStepID, stepStack, paymentMeta, createWorkspaceMeta, justCreatingWorkspace } = state;
  const { stepBack, stepForward, onCancel } = actions;

  const currentStepMeta = STEP_META[currentStepID];
  const hasBackButton = currentStepMeta?.canBack && stepStack.length > 1;
  const hasSkipButton = currentStepMeta?.canSkip && !!currentStepMeta?.skipTo;

  let titleMeta;

  if (currentStepID === StepID.PAYMENT) {
    titleMeta = paymentMeta.plan;
  } else if (currentStepID === StepID.ADD_COLLABORATORS) {
    titleMeta = createWorkspaceMeta.workspaceName;
  }

  if (currentStepID === StepID.WELCOME) {
    return <Container />;
  }

  const filteredStepStack = stepStack.filter((stepID) => stepID !== StepID.WELCOME);
  const filteredNumberOfSteps = stepStack.includes(StepID.WELCOME) ? numberOfSteps - 1 : numberOfSteps;

  const title = STEP_META[currentStepID].title(titleMeta);

  return (
    <CreationHeader
      title={title}
      stepStack={filteredStepStack}
      numberOfSteps={filteredNumberOfSteps}
      hasBackButton={hasBackButton}
      stepBack={stepBack}
      canCancel={justCreatingWorkspace}
      onCancel={onCancel}
      hasSkipButton={hasSkipButton}
      onSkipClick={() => stepForward(currentStepMeta?.skipTo(state), { skip: true })}
    >
      {STEP_META[currentStepID].docsLink}
    </CreationHeader>
  );
};

export default OnboardingHeader;
