import _ from 'lodash';
import React from 'react';

import { useSmartReducer } from '@/hooks';

import { STEP_IDS } from './constants';

export const OnboardingContext = React.createContext<OnboardingContextProps>({
  actions: {
    closeOnboarding: _.constant(null),
    setCreateWorkspaceMeta: _.constant(null),
    setPersonalizeWorkspaceMeta: _.constant(null),
    stepBack: _.constant(null),
    stepForward: _.constant(null),
  },
  state: {
    createWorkspaceMeta: { workspaceImage: 'string', workspaceName: 'string' },
    currentStepID: STEP_IDS?.CREATE_WORKSPACE,
    numberOfSteps: 0,
    personalizeWorkspaceMeta: { channels: [], role: '', teamSize: '' },
    stepStack: [],
  },
});

export const { Consumer: OnboardingConsumer } = OnboardingContext;

export type OnboardingContextProps = {
  state: {
    stepStack: STEP_IDS[];
    currentStepID: STEP_IDS;
    numberOfSteps: number;
    createWorkspaceMeta: {
      workspaceName: string;
      workspaceImage: string;
    };
    personalizeWorkspaceMeta: {
      role: string;
      channels: string[];
      teamSize: string;
    };
  };
  actions: {
    stepBack: () => null;
    stepForward: (stepID: STEP_IDS | null) => void;
    closeOnboarding: () => void;
    setCreateWorkspaceMeta: (data: {}) => void;
    setPersonalizeWorkspaceMeta: (data: {}) => void;
  };
};

type OnboardingProviderProps = {
  numberOfSteps?: number;
  children: React.ReactNode;
};

export const OnboardingProvider = ({ numberOfSteps = 3, children }: OnboardingProviderProps) => {
  const [state, actions] = useSmartReducer({
    stepStack: [STEP_IDS.CREATE_WORKSPACE],
    createWorkspaceMeta: {},
    personalizeWorkspaceMeta: {},
    numberOfSteps,
  });

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
    },
  };
  return <OnboardingContext.Provider value={api}>{children}</OnboardingContext.Provider>;
};
