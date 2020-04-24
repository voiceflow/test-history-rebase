import _ from 'lodash';
import React from 'react';

import client from '@/client';
import { toast as toastNotif } from '@/components/Toast';
import { BillingPeriod, PLANS, UserRole } from '@/constants';
import { createWorkspace, fetchWorkspace, sendInvite, updateCurrentWorkspace } from '@/ducks/workspace';
import { connect, withStripe } from '@/hocs';
import { useSmartReducer } from '@/hooks';
import { PlanType } from '@/models';
import { asyncForEach } from '@/utils/array';
import { compose } from '@/utils/functional';

import { StepID } from './constants';
import { CollaboratorType } from './types';

const toast: any = toastNotif;

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
    onboardingComplete: boolean;
    sendingRequests: boolean;
  };
  actions: {
    stepBack: () => null;
    stepForward: (stepID: StepID | null) => void;
    closeOnboarding: () => void;
    setCreateWorkspaceMeta: (data: {}) => void;
    setPersonalizeWorkspaceMeta: (data: {}) => void;
    setPaymentMeta: (data: {}) => void;
    setAddCollaboratorMeta: (data: {}) => void;
    finishCreateOnboarding: () => void;
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
    finishCreateOnboarding: _.constant(null),
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
    onboardingComplete: false,
    sendingRequests: false,
  },
});

export const { Consumer: OnboardingConsumer } = OnboardingContext;

type OnboardingProviderProps = {
  query?: any;
  numberOfSteps?: number;
  children: React.ReactNode;
  createWorkspace: (data: { name: string; image: string }) => { id: string };
  sendInvite: (email: string, permission: UserRole, showToasts?: boolean) => void;
  updateCurrentWorkspace: (id: string) => void;
  stripe: any;
  checkChargeable: (data: any) => void;
  updateWorkspace: () => void;
};

const OnboardingProviderFunc: React.ComponentType<OnboardingProviderProps> = ({
  query,
  children,
  updateWorkspace,
  stripe,
  checkChargeable,
  updateCurrentWorkspace,
  createWorkspace,
  sendInvite,
}) => {
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
    onboardingComplete: false,
    sendingRequests: false,
  });

  const { stepStack, createWorkspaceMeta, addCollaboratorMeta, paymentMeta } = state;
  const { setStepStack, setOnboardingComplete, setSendingRequests } = actions;

  const stepForward = async (stepID: StepID | null) => {
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

  const checkPayment = async () => {
    const stripeSource = await stripe.createSource({
      type: 'card',
    });
    const source = stripeSource.source;
    if (!source) {
      throw new Error(stripeSource.error?.message || 'Invalid Card Information');
    }

    try {
      await checkChargeable(source);
    } catch (e) {
      throw new Error('Something went wrong');
    }

    return source;
  };

  const handlePayment = async (workspaceID: string, source: any) => {
    await client.workspace.checkout(workspaceID, {
      plan: paymentMeta.plan,
      seats: addCollaboratorMeta.length,
      period: paymentMeta.period,
      coupon: paymentMeta.couponCode || undefined,
      source_id: source?.id,
    });

    updateWorkspace();
  };

  const finishCreateOnboarding = async () => {
    setSendingRequests(true);
    const isOnLastStep = stepStack.length === numberOfSteps;
    const hasPaymentStep = stepStack.includes(StepID.PAYMENT);
    if (isOnLastStep) {
      const name = createWorkspaceMeta.workspaceName;
      const workspaceImage = createWorkspaceMeta.workspaceImage;
      let source;
      if (hasPaymentStep) {
        try {
          source = await checkPayment();
        } catch (e) {
          setSendingRequests(false);
          return toast.error(e);
        }
      }

      const { id } = await createWorkspace({ name, image: workspaceImage });

      updateCurrentWorkspace(id);
      const teamMembers: CollaboratorType[] = addCollaboratorMeta.collaborators.shift();

      await asyncForEach(teamMembers, async (member: CollaboratorType) => {
        const { email, permission } = member;
        await sendInvite(email, permission, false);
      });

      if (hasPaymentStep) {
        try {
          await handlePayment(id, source);
        } catch (e) {
          setSendingRequests(false);
          return toast.error(e);
        }
      }

      setSendingRequests(false);
      setOnboardingComplete(true);
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
      finishCreateOnboarding,
    },
  };
  return <OnboardingContext.Provider value={api}>{children}</OnboardingContext.Provider>;
};

const mapDispatchToProps = {
  createWorkspace,
  sendInvite,
  updateCurrentWorkspace,
  updateWorkspace: fetchWorkspace,
};

export const OnboardingProvider: any = compose(withStripe, connect(null, mapDispatchToProps))(OnboardingProviderFunc);
