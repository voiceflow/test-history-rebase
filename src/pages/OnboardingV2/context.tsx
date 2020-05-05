import _ from 'lodash';
import React from 'react';
import { useDispatch } from 'react-redux';

import client from '@/client';
import { toast as toastNotif } from '@/components/Toast';
import { BillingPeriod, PlanType, UserRole, WORKSPACES_LIMIT } from '@/constants';
import { userSelector } from '@/ducks/account';
import { goToDashboard } from '@/ducks/router';
import {
  activeWorkspaceIDSelector,
  allWorkspacesSelector,
  createWorkspace,
  fetchWorkspaces,
  sendInvite,
  updateCurrentWorkspace,
  validateInvite,
} from '@/ducks/workspace';
import { connect, withStripe } from '@/hocs';
import { useSmartReducer, useTrackingEvents } from '@/hooks';
import { asyncForEach } from '@/utils/array';
import { compose } from '@/utils/functional';

import StepID from './StepIDs';
import { STEP_META } from './constants';
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
    joinWorkspaceMeta: {
      role: string;
    };
    onboardingComplete: boolean;
    sendingRequests: boolean;
    workspaceId: string;
  };
  actions: {
    stepBack: () => null;
    stepForward: (stepID: StepID | null, options?: { skip: boolean }) => void;
    closeOnboarding: () => void;
    setCreateWorkspaceMeta: (data: {}) => void;
    setPersonalizeWorkspaceMeta: (data: {}) => void;
    setPaymentMeta: (data: {}) => void;
    setJoinWorkspaceMeta: (data: {}) => void;
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
    setJoinWorkspaceMeta: _.constant(null),
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
    joinWorkspaceMeta: {
      role: '',
    },
    onboardingComplete: false,
    sendingRequests: false,
    workspaceId: '',
  },
});

export const { Consumer: OnboardingConsumer } = OnboardingContext;

export enum onBoardingType {
  create = 'create_workspace',
  join = 'join_workpsace',
}

type OnboardingProviderProps = {
  workspaces: string[];
  query: { ob_payment?: string; ob_plan?: PlanType; ob_coupon?: any; ob_period?: BillingPeriod; invite?: string };
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
  account: any;
  currentWorkspaceId?: string;
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
  ob_plan?: PlanType;
  ob_coupon?: any;
  ob_period?: BillingPeriod;
  invite?: string;
}) => {
  const configurations = {
    plan: PlanType.PRO,
    period: BillingPeriod.ANNUALLY,
    couponCode: ob_coupon || '',
    flow: invite ? onBoardingType.join : onBoardingType.create,
  };
  if (ob_plan && Object.values(PlanType).includes(ob_plan)) {
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
  account,
  currentWorkspaceId,
}) => {
  const dispatch = useDispatch();
  const [trackingEvents] = useTrackingEvents();
  const { plan, period, couponCode, flow } = extractQueryParams(query);
  const firstStep = getFirstStep(flow);
  const numberOfSteps = getNumberOfSteps(query, firstStep);

  const [state, actions] = useSmartReducer({
    workspaceId: '',
    stepStack: [firstStep],
    createWorkspaceMeta: {},
    personalizeWorkspaceMeta: {},
    paymentMeta: {
      plan,
      couponCode,
      period,
    },
    addCollaboratorMeta: { isDemoBooked: false, collaborators: [] },
    joinWorkspaceMeta: {
      role: '',
    },
    numberOfSteps,
    onboardingComplete: false,
    sendingRequests: false,
  });

  const { stepStack, createWorkspaceMeta, addCollaboratorMeta, paymentMeta } = state;
  const { setStepStack, setOnboardingComplete, setSendingRequests } = actions;

  const cache = React.useRef({ stepStack, state, skipped: false });

  cache.current.state = state;

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

    if (workspaces.length >= WORKSPACES_LIMIT || !isOnLastStep) {
      return null;
    }

    const name = createWorkspaceMeta.workspaceName;
    const workspaceImage = createWorkspaceMeta.workspaceImage;
    let source;

    if (hasPaymentStep) {
      try {
        source = await checkPayment();
      } catch (e) {
        setSendingRequests(false);
        toast.error(e);
        return null;
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
        toast.error(e);
        return null;
      }
    }
    const teamMembers: CollaboratorType[] = addCollaboratorMeta.collaborators.slice(1, addCollaboratorMeta.length);

    await asyncForEach(teamMembers, async (member: CollaboratorType) => {
      const { email, permission } = member;
      await sendInvite(email, permission, false);
    });

    setSendingRequests(false);
    setOnboardingComplete(true);

    const { role, channels, teamSize } = state.personalizeWorkspaceMeta;
    const { email, name: userName } = account;

    trackingEvents.trackOnboardingV2Identify({
      name: userName,
      role,
      email,
      channels,
      teamSize,
    });

    goToDashboard();

    toastNotif.success('Successfully created workspace');

    return workspace;
  };

  const handleLastStep = async (currentStepID: StepID) => {
    let workspaceId: string | null = null;

    if (currentStepID === StepID.ADD_COLLABORATORS || currentStepID === StepID.PAYMENT) {
      const workspace = await finishCreateOnboarding();
      workspaceId = workspace?.id ?? null;
    } else if (currentStepID === StepID.JOIN_WORKSPACE) {
      workspaceId = currentWorkspaceId ?? null;

      await finishJoiningWorkspace();
    }

    return workspaceId;
  };

  const stepForward = async (stepID: StepID | null, { skip = false }: { skip?: boolean } = {}) => {
    const isLastStep = stepStack.length === numberOfSteps;
    const currentStepID: StepID = stepStack[0];

    if (isLastStep) {
      const workspaceID = await handleLastStep(currentStepID);

      dispatch(STEP_META[currentStepID].trackStep(cache.current.state, { skip }));

      if (workspaceID) {
        trackingEvents.trackOnboardingV2Complete({ skip, workspaceID });
      }
    } else if (!stepStack.includes(stepID)) {
      cache.current.skipped = skip;
      setStepStack([stepID, ...stepStack]);
    }
  };

  React.useEffect(() => {
    if (cache.current.stepStack.length < stepStack.length) {
      const prevStepID: StepID = cache.current.stepStack[0];

      dispatch(STEP_META[prevStepID].trackStep(cache.current.state, { skip: cache.current.skipped }));
    }

    cache.current.stepStack = stepStack;
  }, [stepStack]);

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
  account: userSelector,
  currentWorkspaceId: activeWorkspaceIDSelector,
};

const mapDispatchToProps = {
  createWorkspace,
  sendInvite,
  validateInvite,
  goToDashboard,
  updateCurrentWorkspace,
  fetchWorkspaces,
};

export const OnboardingProvider: any = compose(withStripe, connect(mapStateToProps, mapDispatchToProps))(OnboardingProviderFunc);
