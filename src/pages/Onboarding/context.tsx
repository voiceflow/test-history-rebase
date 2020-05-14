import _ from 'lodash';
import React from 'react';
import { useDispatch } from 'react-redux';

import client from '@/client';
import { toast as toastNotif } from '@/components/Toast';
import { ONBOARDING_ZAPIER_PATH, USERFLOW_ONBOARDING_FLOW_ID, USERFLOW_SIMPLE_ONBOARDING_FLOW_ID } from '@/config';
import { FeatureFlag } from '@/config/features';
import { BillingPeriod, PlanType, PlatformType, UserRole, WORKSPACES_LIMIT } from '@/constants';
import * as Account from '@/ducks/account';
import * as Router from '@/ducks/router';
import * as Workspace from '@/ducks/workspace';
import { connect, withStripe } from '@/hocs';
import { useFeature, useSmartReducer, useTrackingEvents } from '@/hooks';
import { Query } from '@/models';
import { ConnectedProps } from '@/types';
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

const extractQueryParams = ({ ob_plan, ob_coupon, ob_period, invite }: Query) => {
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

type OnboardingProviderProps = {
  query: Query;
  numberOfSteps?: number;
  children: React.ReactNode;
  stripe: any;
  checkChargeable: (data: any) => void;
  trackInvitationAccepted: (workspaceId: string) => void;
};

const OnboardingProviderFunc: React.ComponentType<OnboardingProviderProps & ConnectedOnboardingContextProps> = ({
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
  currentWorkspaceID,
}) => {
  const dispatch = useDispatch();
  const [trackingEvents] = useTrackingEvents();
  const [isFinalizing, setIsFinalizing] = React.useState(false);
  const { plan, period, couponCode, flow } = extractQueryParams(query);
  const firstStep = getFirstStep(flow);
  const numberOfSteps = getNumberOfSteps(query, firstStep);
  const simpleUserflowOnboarding = useFeature(FeatureFlag.SIMPLE_USERFLOW_ONBOARDING);

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
    if (sendingRequests) return;
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
        toast.error('Something went wrong when checking out, please try again later');
        return null;
      }
    }

    let workspace;
    try {
      workspace = await createWorkspace({ name, image: workspaceImage });
    } catch (e) {
      toastNotif.error('Error creating workspace, please try again later');
      setSendingRequests(false);
      return;
    }

    try {
      await fetchWorkspaces();
    } catch (e) {
      toastNotif.error('Error getting workspace, please try again later');
      setSendingRequests(false);
      return;
    }

    updateCurrentWorkspace(workspace.id);

    if (hasPaymentStep) {
      try {
        await handlePayment(workspace.id, source);
      } catch (e) {
        setSendingRequests(false);
        toast.error('Something went wrong when checking out, please try again later');
        return null;
      }
    }
    const teamMembers: CollaboratorType[] = addCollaboratorMeta.collaborators.slice(1, addCollaboratorMeta.length);

    await asyncForEach(teamMembers, async (member: CollaboratorType) => {
      const { email, permission } = member;
      try {
        await sendInvite(email, permission, false);
      } catch (e) {
        toastNotif.error(`Problem inviting ${email}, please try again later`);
      }
    });

    setOnboardingComplete(true);

    const { role, channels, teamSize } = state.personalizeWorkspaceMeta;
    const { email, name: userName } = account;

    try {
      trackingEvents.trackOnboardingIdentify({
        name: userName!,
        role,
        email: email!,
        channels,
        teamSize,
      });
    } catch (e) {
      console.error('Error tracking');
    }

    try {
      const { skill_id, diagram } = await createProject(
        workspace.id,
        { name: ONBOARDING_PROJECT_NAME, locales: ['en-US'], platform: PlatformType.ALEXA },
        1
      );
      await goToCanvas(skill_id, diagram);
      await Userflow.startFlow(simpleUserflowOnboarding.isEnabled ? USERFLOW_SIMPLE_ONBOARDING_FLOW_ID : USERFLOW_ONBOARDING_FLOW_ID);
      toastNotif.success('Successfully created workspace');
    } catch (error) {
      // if it fails to create a project for the user, go to dashboard
      console.error(error);
      goToDashboard();
    }

    setSendingRequests(false);

    if (addCollaboratorMeta.isDemoBooked) {
      sendZap(userName!, email!, workspace.id, name);
    }

    return workspace;
  };

  const handleLastStep = async (currentStepID: StepID) => {
    let workspaceId: string | null = null;

    if (currentStepID === StepID.ADD_COLLABORATORS || currentStepID === StepID.PAYMENT) {
      const workspace = await finishCreateOnboarding();
      workspaceId = workspace?.id ?? null;
    } else if (currentStepID === StepID.JOIN_WORKSPACE) {
      workspaceId = currentWorkspaceID ?? null;

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
      let workspaceID;
      try {
        workspaceID = await handleLastStep(currentStepID);
      } catch (e) {
        // If anything catastrophic goes wrong, fallback to dashboard
        toastNotif.error('Sorry, something went wrong, try again in a bit.');
        goToDashboard();
      }

      dispatch(STEP_META[currentStepID].trackStep(cache.current.state, { skip: false }));

      if (workspaceID) {
        trackingEvents.trackOnboardingComplete({ skip: false, workspaceID });
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
  workspaces: Workspace.allWorkspacesSelector,
  account: Account.userSelector,
  currentWorkspaceID: Workspace.activeWorkspaceIDSelector,
};

const mapDispatchToProps = {
  createWorkspace: Workspace.createWorkspace,
  sendInvite: Workspace.sendInvite,
  goToCanvas: Router.goToCanvas,
  validateInvite: Workspace.validateInvite,
  goToDashboard: Router.goToDashboard,
  updateCurrentWorkspace: Workspace.updateCurrentWorkspace,
  fetchWorkspaces: Workspace.fetchWorkspaces,
  createProject: Workspace.createProject,
};

type ConnectedOnboardingContextProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export const OnboardingProvider: any = compose(withStripe, connect(mapStateToProps, mapDispatchToProps))(OnboardingProviderFunc);
