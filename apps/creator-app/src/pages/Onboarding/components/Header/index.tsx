import React from 'react';

import { STEP_META, StepID } from '@/pages/Onboarding/constants';
import { useOnboardingContext } from '@/pages/Onboarding/context';
import { ClassName } from '@/styles/constants';

import ActionButton from './ActionButton';
import StepStatus from './StepStatus';
import * as StepStatusStyles from './StepStatus/styles';
import * as S from './styles';

const OnboardingHeader: React.FC = () => {
  const {
    state: { stepStack, steps },
    stepBack,
    stepForward,
    getCurrentStepID,
  } = useOnboardingContext();

  const currentStepID = getCurrentStepID();

  const currentStepMeta = STEP_META[currentStepID];
  const hasBackButton = currentStepMeta?.canBack && stepStack.length > 1;
  const hasSkipButton = currentStepMeta?.canSkip;

  if (currentStepID === StepID.WELCOME) {
    return <StepStatusStyles.Container />;
  }

  const filteredStepStack = stepStack.filter((stepID) => stepID !== StepID.WELCOME);
  const filteredNumberOfSteps = stepStack.includes(StepID.WELCOME) ? steps.length - 1 : steps.length;

  const title = STEP_META[currentStepID].title(undefined);

  return (
    <S.Container>
      <ActionButton
        className={ClassName.CREATE_PROJECT_LEFT_ACTION}
        shouldRender={hasBackButton}
        icon="back"
        onClick={stepBack}
        label="back"
      />
      <StepStatus title={title} numberOfSteps={filteredNumberOfSteps} stepStack={filteredStepStack} />

      {!!STEP_META[currentStepID].docsLink && (
        <S.Content withOffset={hasSkipButton}>{STEP_META[currentStepID].docsLink}</S.Content>
      )}

      <ActionButton
        className={ClassName.CREATE_PROJECT_RIGHT_ACTION}
        shouldRender={hasSkipButton}
        icon="next"
        label="skip"
        onClick={() => stepForward({ skip: true })}
      />
    </S.Container>
  );
};

export default OnboardingHeader;
