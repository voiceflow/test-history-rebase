import _ from 'lodash';
import React from 'react';
import { useDispatch } from 'react-redux';

import client from '@/client';
import { toast as toastNotif } from '@/components/Toast';
import { ONBOARDING_ZAPIER_PATH, USERFLOW_ONBOARDING_FLOW_ID } from '@/config';
import { BillingPeriod, PlanType, PlatformType, UserRole, WORKSPACES_LIMIT } from '@/constants';
import { userSelector } from '@/ducks/account';
import { goToCanvas, goToDashboard } from '@/ducks/router';
import {
  NewProjectOptions,
  activeWorkspaceIDSelector,
  allWorkspacesSelector,
  createProject,
  createWorkspace,
  fetchWorkspaces,
  sendInvite,
  updateCurrentWorkspace,
  validateInvite,
} from '@/ducks/workspace';
import { connect, withStripe } from '@/hocs';
import { useSmartReducer, useTrackingEvents } from '@/hooks';
import { DBProject } from '@/models';
import { asyncForEach } from '@/utils/array';
import { compose } from '@/utils/functional';
import * as Userflow from '@/vendors/userflow';

import StepID from './StepIDs';
import { ONBOARDING_PROJECT_NAME, STEP_META } from './constants';
import { CollaboratorType } from './types';

const toast: any = toastNotif;

export const getNumberOfEditorSeats = (collaborators: CollaboratorType[]) => {
  return collaborators.filter((collaborator: CollaboratorType) => {
    const { permission } = collaborator;
    return permission === UserRole.ADMIN || permission === UserRole.EDITOR;
  }).length;
};

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
  goToCanvas: (skillID: string, diagramID: string) => void;
  validateInvite: (invite: string) => string;
  trackInvitationAccepted: (workspaceId: string) => void;
  createProject: (workspaceID: string, project: NewProjectOptions, templateID: number) => DBProject;
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
  goToCanvas,
  updateCurrentWorkspace,
  createWorkspace,
  sendInvite,
  fetchWorkspaces,
  validateInvite,
  createProject,
  workspaces,
  trackInvitationAccepted,
  account,
  currentWorkspaceId,
}) => {
  const dispatch = useDispatch();
  const [trackingEvents] = useTrackingEvents();
  const [isFinalizing, setIsFinalizing] = React.useState(false);
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

  const { stepStack, createWorkspaceMeta, addCollaboratorMeta, paymentMeta, sendingRequests } = state;
  const { setStepStack, setOnboardingComplete, setSendingRequests } = actions;

  const cache = React.useRef({ stepStack, state, skipped: false });

  cache.current.state = state;

  const stepBack = () => {
    if (stepStack.length > 1) {
      const [, ...newStepStack] = stepStack;
      setStepStack([...newStepStack]);
    }
  };

  const sendZap = (name: string, email: string, workspaceID: string, workspaceName: string) => {
    client.zapier.triggerZap(ONBOARDING_ZAPIER_PATH, { name, email, workspaceID, workspaceName });
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
    const numberOfEditors = getNumberOfEditorSeats(addCollaboratorMeta.collaborators);

    await client.workspace.checkout(workspaceID, {
      plan,
      seats: numberOfEditors,
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
    if (sendingRequests) return;

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

    try {
      const { skill_id, diagram } = await createProject(
        workspace.id,
        { name: ONBOARDING_PROJECT_NAME, locales: ['en-US'], platform: PlatformType.ALEXA },
        1
      );
      goToCanvas(skill_id, diagram);
      await Userflow.startFlow(USERFLOW_ONBOARDING_FLOW_ID);
    } catch (error) {
      // if it fails to create a project for the user, go to dashboard
      console.error(error);
      toastNotif.success('Successfully created workspace');
      goToDashboard();
    }

    setSendingRequests(false);

    if (addCollaboratorMeta.isDemoBooked) {
      sendZap(userName, email, workspace.id, name);
    }

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
    if (isLastStep) {
      setIsFinalizing(true);
    } else if (!stepStack.includes(stepID)) {
      cache.current.skipped = skip;
      setStepStack([stepID, ...stepStack]);
    }
  };

  React.useEffect(() => {
    const isLastStep = stepStack.length === numberOfSteps;
    const lastStepHandler = async () => {
      const currentStepID: StepID = stepStack[0];
      const workspaceID = await handleLastStep(currentStepID);

      dispatch(STEP_META[currentStepID].trackStep(cache.current.state, { skip: false }));

      if (workspaceID) {
        trackingEvents.trackOnboardingV2Complete({ skip: false, workspaceID });
      }
    };
    if (isFinalizing && isLastStep) {
      lastStepHandler();
    }
  }, [isFinalizing]);

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
  goToCanvas,
  validateInvite,
  goToDashboard,
  updateCurrentWorkspace,
  fetchWorkspaces,
  createProject,
};

export const OnboardingProvider: any = compose(withStripe, connect(mapStateToProps, mapDispatchToProps))(OnboardingProviderFunc);
