import React from 'react';

import { withContext } from '@/hocs';
import { useSmartReducer } from '@/hooks';

import { STEP_IDS } from './constants';

export const OnboardingContext = React.createContext({});
export const { Consumer: OnboardingConsumer } = OnboardingContext;

export type OnboardingContextProps = {
  onboarding: {
    state: {
      stepStack: STEP_IDS[];
      currentStepID: STEP_IDS;
      numberOfSteps: number;
    };
    actions: {
      stepBack: () => null;
      stepForward: (stepID: STEP_IDS | null) => void;
      closeOnboarding: () => void;
    };
  };
};

type OnboardingProviderProps = {
  numberOfSteps?: number;
  children: React.ReactNode;
};

export const OnboardingProvider = ({ numberOfSteps = 3, children }: OnboardingProviderProps) => {
  const [state, actions] = useSmartReducer({
    stepStack: [STEP_IDS.ADD_COLLABORATORS, STEP_IDS.CREATE_WORKSPACE],
    numberOfSteps,
  });

  // const { close } = useModals(ModalType.ONBOARDING);

  const { stepStack } = state;
  const { setStepStack } = actions;

  const stepForward = (stepID: STEP_IDS | null) => {
    if (!stepStack.includes(stepID)) {
      setStepStack([stepID, ...stepStack]);
    }
  };

  const stepBack = () => {
    if (stepStack.length > 1) {
      const [, ...newStepStack] = stepStack;
      setStepStack([...newStepStack]);
    }
  };

  const api = {
    state: {
      ...state,
      currentStepID: stepStack[0],
    },
    actions: {
      ...actions,
      stepForward,
      stepBack,
      // closeOnboarding: close,
    },
  };
  return <OnboardingContext.Provider value={api}>{children}</OnboardingContext.Provider>;
};

export const withOnboarding = withContext(OnboardingContext, 'onboarding');
