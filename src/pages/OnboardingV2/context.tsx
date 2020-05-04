import _ from 'lodash';
import React from 'react';

import client from '@/client';
import { toast as toastNotif } from '@/components/Toast';
import { BillingPeriod, PLANS, UserRole, WORKSPACES_LIMIT } from '@/constants';
import { goToDashboard } from '@/ducks/router';
import * as Tracking from '@/ducks/tracking';
import { allWorkspacesSelector, createWorkspace, fetchWorkspaces, sendInvite, updateCurrentWorkspace, validateInvite } from '@/ducks/workspace';
import { connect, withStripe } from '@/hocs';
import { useSmartReducer } from '@/hooks';
import { PlanType } from '@/models';
import { asyncForEach } from '@/utils/array';
import { compose } from '@/utils/functional';

import StepID from './StepIDs';
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
    finishJoiningWorkspace: () => void;
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
    finishJoiningWorkspace: _.constant(null),
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
      couponCode: '',
    },
    onboardingComplete: false,
    sendingRequests: false,
  },
});

export const { Consumer: OnboardingConsumer } = OnboardingContext;

export enum onBoardingType {
  create = 'create_workspace',
  join = 'join_workpsace',
}

type OnboardingProviderProps = {
  workspaces: string[];
  query: { ob_payment?: string; ob_plan?: PLANS; ob_coupon?: any; ob_period?: BillingPeriod; invite?: string };
  numberOfSteps?: number;
  children: React.ReactNode;
  createWorkspace: (data: { name: string; image: string }) => { id: string };
  sendInvite: (email: string, permission: UserRole, showToasts?: boolean) => void;
  updateCurrentWorkspace: (id: string) => void;
  stripe: any;
  checkChargeable: (data: any) => void;
  fetchWorkspaces: () => void;
  goToDashboard: () => void;
  validateInvite: (invite: string) => string;
  trackInvitationAccepted: (workspaceId: string) => void;
};

const getFirstStep = (flow: onBoardingType) => {
  switch (flow) {
    case onBoardingType.create:
      return StepID.CREATE_WORKSPACE;
    case onBoardingType.join:
      return StepID.JOIN_WORKSPACE;
    default:
      return StepID.CREATE_WORKSPACE;
  }
};

const getNumberOfSteps = (query: any, firstStep: StepID) => {
  if (firstStep === StepID.JOIN_WORKSPACE) {
    return 1;
  }
  if (!query?.ob_payment) {
    return 3;
  }
  return 4;
};

const extractQueryParams = ({
  ob_plan,
  ob_coupon,
  ob_period,
  invite,
}: {
  ob_plan?: PLANS;
  ob_coupon?: any;
  ob_period?: BillingPeriod;
  invite?: string;
}) => {
  const configurations = {
    plan: PLANS.PRO,
    period: BillingPeriod.ANNUALLY,
    couponCode: ob_coupon || '',
    flow: invite ? onBoardingType.join : onBoardingType.create,
  };
  if (ob_plan && Object.values(PLANS).includes(ob_plan)) {
    configurations.plan = ob_plan;
  }

  if (ob_period && Object.values(BillingPeriod).includes(ob_period)) {
    configurations.period = ob_period;
  }

  return configurations;
};

const OnboardingProviderFunc: React.ComponentType<OnboardingProviderProps> = ({
  query,
  children,
  stripe,
  checkChargeable,
  goToDashboard,
  updateCurrentWorkspace,
  createWorkspace,
  sendInvite,
  fetchWorkspaces,
  validateInvite,
  workspaces,
  trackInvitationAccepted,
}) => {
  const { plan, period, couponCode, flow } = extractQueryParams(query);
  const firstStep = getFirstStep(flow);
  const numberOfSteps = getNumberOfSteps(query, firstStep);

  const [state, actions] = useSmartReducer({
    stepStack: [firstStep],
    createWorkspaceMeta: {},
    personalizeWorkspaceMeta: {},
    paymentMeta: {
      plan,
      couponCode,
      period,
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
    const { plan, period, couponCode } = paymentMeta;
    await client.workspace.checkout(workspaceID, {
      plan,
      seats: addCollaboratorMeta.collaborators.length,
      period,
      coupon: couponCode || undefined,
      source_id: source?.id,
    });
  };

  const finishJoiningWorkspace = async () => {
    const newWorkspaceID = await validateInvite(query.invite || '');
    if (!newWorkspaceID) {
      toastNotif.error('Error joining workspace');
    } else {
      await fetchWorkspaces();
      updateCurrentWorkspace(newWorkspaceID);

      goToDashboard();
      trackInvitationAccepted(newWorkspaceID);
      setOnboardingComplete(true);

      toastNotif.success('Successfully joined workspace');
    }
  };

  const finishCreateOnboarding = async () => {
    setSendingRequests(true);
    const isOnLastStep = stepStack.length === numberOfSteps;
    const hasPaymentStep = stepStack.includes(StepID.PAYMENT);

    if (workspaces.length >= WORKSPACES_LIMIT) return;

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

      const workspace = await createWorkspace({ name, image: workspaceImage });
      await fetchWorkspaces();
      updateCurrentWorkspace(workspace.id);

      if (hasPaymentStep) {
        try {
          await handlePayment(workspace.id, source);
        } catch (e) {
          setSendingRequests(false);
          return toast.error(e);
        }
      }
      const teamMembers: CollaboratorType[] = addCollaboratorMeta.collaborators.slice(1, addCollaboratorMeta.length);
      await asyncForEach(teamMembers, async (member: CollaboratorType) => {
        const { email, permission } = member;
        await sendInvite(email, permission, false);
      });

      setSendingRequests(false);
      setOnboardingComplete(true);
      goToDashboard();
      toastNotif.success('Successfully created workspace');
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
      finishJoiningWorkspace,
      finishCreateOnboarding,
    },
  };
  return <OnboardingContext.Provider value={api}>{children}</OnboardingContext.Provider>;
};

const mapStateToProps = {
  workspaces: allWorkspacesSelector,
};

const mapDispatchToProps = {
  createWorkspace,
  sendInvite,
  validateInvite,
  goToDashboard,
  updateCurrentWorkspace,
  fetchWorkspaces,
  trackInvitationAccepted: Tracking.trackInvitationAccepted,
};

export const OnboardingProvider: any = compose(withStripe, connect(mapStateToProps, mapDispatchToProps))(OnboardingProviderFunc);
