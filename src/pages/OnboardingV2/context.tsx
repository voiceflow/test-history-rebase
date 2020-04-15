import _ from 'lodash';
import React from 'react';

import { PERIOD, PLANS } from '@/constants';
import { useSmartReducer } from '@/hooks';

import { STEP_IDS } from './constants';

export const OnboardingContext = React.createContext<OnboardingContextProps>({
  actions: {
    closeOnboarding: _.constant(null),
    setCreateWorkspaceMeta: _.constant(null),
    setPersonalizeWorkspaceMeta: _.constant(null),
    setPaymentMeta: _.constant(null),
    stepBack: _.constant(null),
    stepForward: _.constant(null),
  },
  state: {
    createWorkspaceMeta: { workspaceImage: 'string', workspaceName: 'string' },
    currentStepID: STEP_IDS?.CREATE_WORKSPACE,
    numberOfSteps: 0,
    personalizeWorkspaceMeta: { channels: [], role: '', teamSize: '' },
    paymentMeta: {
      period: PERIOD.monthly,
    },
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
    paymentMeta: {
      plan?: string;
      couponCode?: string;
      period: string;
    };
  };
  actions: {
    stepBack: () => null;
    stepForward: (stepID: STEP_IDS | null) => void;
    closeOnboarding: () => void;
    setCreateWorkspaceMeta: (data: {}) => void;
    setPersonalizeWorkspaceMeta: (data: {}) => void;
    setPaymentMeta: (data: {}) => void;
  };
};

type OnboardingProviderProps = {
  query?: any;
  numberOfSteps?: number;
  children: React.ReactNode;
};

export const OnboardingProvider = ({ query, children }: OnboardingProviderProps) => {
  const { plan, couponCode, period } = query;

  let numberOfSteps = 3;
  if (query) numberOfSteps = 4;

  const [state, actions] = useSmartReducer({
    stepStack: [STEP_IDS.CREATE_WORKSPACE],
    createWorkspaceMeta: {},
    personalizeWorkspaceMeta: {},
    paymentMeta: {
      plan: plan || PLANS.pro,
      couponCode,
      period: period || PERIOD.monthly,
    },
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
