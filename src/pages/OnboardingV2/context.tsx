import _ from 'lodash';
import React from 'react';

import { BillingPeriod, PLANS } from '@/constants';
import { useSmartReducer } from '@/hooks';
import { PlanType } from '@/models';

import { StepID } from './constants';
import { CollaboratorType } from './types';

export type OnboardingContextProps = {
  state: {
    stepStack: StepID[];
    currentStepID: StepID;
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
      plan?: PlanType;
      couponCode?: string;
      period: BillingPeriod;
    };
    addCollaboratorMeta: {
      isDemoBooked: boolean;
      collaborators: CollaboratorType[];
    };
  };
  actions: {
    stepBack: () => null;
    stepForward: (stepID: StepID | null) => void;
    closeOnboarding: () => void;
    setCreateWorkspaceMeta: (data: {}) => void;
    setPersonalizeWorkspaceMeta: (data: {}) => void;
    setPaymentMeta: (data: {}) => void;
    setAddCollaboratorMeta: (data: {}) => void;
  };
};

export const OnboardingContext = React.createContext<OnboardingContextProps>({
  actions: {
    closeOnboarding: _.constant(null),
    setCreateWorkspaceMeta: _.constant(null),
    setPersonalizeWorkspaceMeta: _.constant(null),
    setPaymentMeta: _.constant(null),
    stepBack: _.constant(null),
    stepForward: _.constant(null),
    setAddCollaboratorMeta: _.constant(null),
  },
  state: {
    createWorkspaceMeta: { workspaceImage: 'string', workspaceName: 'string' },
    currentStepID: StepID?.CREATE_WORKSPACE,
    numberOfSteps: 0,
    personalizeWorkspaceMeta: { channels: [], role: '', teamSize: '' },
    stepStack: [],
    addCollaboratorMeta: { isDemoBooked: false, collaborators: [] },
    paymentMeta: {
      period: BillingPeriod.MONTHLY,
    },
  },
});

export const { Consumer: OnboardingConsumer } = OnboardingContext;

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
    stepStack: [StepID.CREATE_WORKSPACE],
    createWorkspaceMeta: {},
    personalizeWorkspaceMeta: {},
    paymentMeta: {
      plan: plan || PLANS.pro,
      couponCode,
      period: period || BillingPeriod.MONTHLY,
    },
    addCollaboratorMeta: { isDemoBooked: false, collaborators: [] },
    numberOfSteps,
  });

  const { stepStack } = state;
  const { setStepStack } = actions;

  const stepForward = (stepID: StepID | null) => {
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
