import React, { useContext } from 'react';

import { STEP_META, StepID } from '@/pages/Onboarding/constants';
import { OnboardingContext } from '@/pages/Onboarding/context';
import { ClassName } from '@/styles/constants';

import { ActionButton, Container, Content, StepStatus } from './components';
import * as StepStatusStyles from './components/StepStatus/styles';

const OnboardingHeader: React.FC = () => {
  const { state, actions } = useContext(OnboardingContext);
  const { numberOfSteps, currentStepID, stepStack, paymentMeta, justCreatingWorkspace } = state;
  const { stepBack, stepForward, onCancel } = actions;

  const currentStepMeta = STEP_META[currentStepID];
  const hasBackButton = currentStepMeta?.canBack && stepStack.length > 1;
  const hasSkipButton = currentStepMeta?.canSkip && !!currentStepMeta?.skipTo;
  const titleMeta = currentStepID === StepID.PAYMENT ? paymentMeta.plan : undefined;

  if (currentStepID === StepID.WELCOME) {
    return <StepStatusStyles.Container />;
  }

  const filteredStepStack = stepStack.filter((stepID) => stepID !== StepID.WELCOME);
  const filteredNumberOfSteps = stepStack.includes(StepID.WELCOME) ? numberOfSteps - 1 : numberOfSteps;

  const title = STEP_META[currentStepID].title(titleMeta);

  return (
    <Container>
      <ActionButton className={ClassName.CREATE_PROJECT_LEFT_ACTION} shouldRender={hasBackButton} icon="back" onClick={stepBack} label="back" />
      <StepStatus title={title} numberOfSteps={filteredNumberOfSteps} stepStack={filteredStepStack} />

      {!!STEP_META[currentStepID].docsLink && (
        <Content withOffset={!!justCreatingWorkspace || hasSkipButton}>{STEP_META[currentStepID].docsLink}</Content>
      )}

      {justCreatingWorkspace ? (
        <ActionButton className={ClassName.CREATE_PROJECT_RIGHT_ACTION} shouldRender icon="close" label="cancel" onClick={onCancel} />
      ) : (
        <ActionButton
          className={ClassName.CREATE_PROJECT_RIGHT_ACTION}
          shouldRender={hasSkipButton}
          icon="next"
          label="skip"
          onClick={() => stepForward(currentStepMeta?.skipTo(state), { skip: true })}
        />
      )}
    </Container>
  );
};

export default OnboardingHeader;
