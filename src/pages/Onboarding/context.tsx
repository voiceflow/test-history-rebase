import _ from 'lodash';
import React from 'react';
import { useDispatch } from 'react-redux';

import client from '@/client';
import { ButtonVariant } from '@/components/Button/constants';
import { toast as toastNotif } from '@/components/Toast';
import { USERFLOW_ONBOARDING_FLOW_ID } from '@/config';
import { BillingPeriod, ModalType, PlanType, PlatformType, PromoType, UserRole } from '@/constants';
import * as Account from '@/ducks/account';
import * as Router from '@/ducks/router';
import * as Tracking from '@/ducks/tracking';
import * as Workspace from '@/ducks/workspace';
import { connect, withStripe } from '@/hocs';
import { useModals, useSmartReducer, useTrackingEvents } from '@/hooks';
import { Query } from '@/models';
import { ConnectedProps } from '@/types';
import { asyncForEach } from '@/utils/array';
import { compose } from '@/utils/functional';
import * as Userflow from '@/vendors/userflow';

import { ONBOARDING_PROJECT_NAME, STEP_META, StepID } from './constants';
import { CollaboratorType } from './types';

const toast: any = toastNotif;

export const getNumberOfEditorSeats = (collaborators: CollaboratorType[]) => {
  const members = collaborators.filter((collaborator: CollaboratorType) => {
    const { permission } = collaborator;
    return permission === UserRole.EDITOR;
  });
  // + 1 for the owner
  return members.length + 1;
};

export enum OnboardingType {
  create = 'create_workspace',
  join = 'join_workpsace',
  student = 'student',
  creator = 'creator',
}

export enum SpecificFlowType {
  login_vanilla_new = 'login_vanilla_new',
  login_student_new = 'login_student_new',
  login_payment_new = 'login_payment_new',
  login_student_existing = 'login_student_existing',
  login_invite = 'login_invite',
  create_workspace = 'create_workspace',
  login_creator_new = 'login_creator_new',
  login_creator_existing = 'login_creator_existing',
}

export type OnboardingContextProps = {
  state: {
    selectableWorkspace: boolean;
    specificFlowType: SpecificFlowType;
    flow: OnboardingType;
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
      selectedWorkspaceId: string;
    };
    addCollaboratorMeta: {
      collaborators: CollaboratorType[];
    };
    joinWorkspaceMeta: {
      role: string;
    };
    onboardingComplete: boolean;
    sendingRequests: boolean;
    workspaceId: string;
    justCreatingWorkspace: boolean;
    hasFixedPeriod: boolean;
  };
  actions: {
    stepBack: () => null;
    stepForward: (stepID: StepID | null, options?: { skip: boolean }) => void;
    closeOnboarding: () => void;
    setCreateWorkspaceMeta: (data: unknown) => void;
    setPersonalizeWorkspaceMeta: (data: unknown) => void;
    setPaymentMeta: (data: unknown) => void;
    setJoinWorkspaceMeta: (data: unknown) => void;
    setAddCollaboratorMeta: (data: unknown) => void;
    finishCreateOnboarding: () => void;
    finishJoiningWorkspace: () => void;
    onCancel: () => void;
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
    onCancel: _.constant(null),
  },
  state: {
    selectableWorkspace: false,
    flow: OnboardingType.create,
    specificFlowType: SpecificFlowType.create_workspace,
    createWorkspaceMeta: { workspaceImage: 'string', workspaceName: 'string' },
    currentStepID: StepID?.CREATE_WORKSPACE,
    numberOfSteps: 0,
    personalizeWorkspaceMeta: { channels: [], role: '', teamSize: '' },
    stepStack: [],
    addCollaboratorMeta: { collaborators: [] },
    paymentMeta: {
      period: BillingPeriod.MONTHLY,
      couponCode: '',
      selectedWorkspaceId: '',
    },
    joinWorkspaceMeta: {
      role: '',
    },
    onboardingComplete: false,
    sendingRequests: false,
    workspaceId: '',
    justCreatingWorkspace: false,
    hasFixedPeriod: false,
  },
});

export const { Consumer: OnboardingConsumer } = OnboardingContext;

const getFirstStep = (flow: OnboardingType, isLoginFlow: boolean, isFirstSession: boolean) => {
  if (!isLoginFlow) {
    return OnboardingType.create;
  }

  switch (flow) {
    case OnboardingType.create:
      return StepID.WELCOME;
    case OnboardingType.join:
      return StepID.JOIN_WORKSPACE;
    case OnboardingType.creator:
    case OnboardingType.student:
      return isFirstSession ? StepID.WELCOME : StepID.PAYMENT;
    default:
      return StepID.WELCOME;
  }
};

const getSpecificFlowType = (query: Query, flow: OnboardingType, loginFlow: boolean, isFirstSession: boolean) => {
  if (flow === OnboardingType.join) {
    return SpecificFlowType.login_invite;
  }
  if (flow === OnboardingType.student && !isFirstSession) {
    return SpecificFlowType.login_student_existing;
  }
  if (flow === OnboardingType.creator && !isFirstSession) {
    return SpecificFlowType.login_creator_existing;
  }
  if (!loginFlow) {
    return SpecificFlowType.create_workspace;
  }
  if (loginFlow && isFirstSession && flow === OnboardingType.student) {
    return SpecificFlowType.login_student_new;
  }
  if (loginFlow && isFirstSession && flow === OnboardingType.creator) {
    return SpecificFlowType.login_creator_new;
  }
  if (query?.ob_payment) {
    return SpecificFlowType.login_payment_new;
  }
  return SpecificFlowType.login_vanilla_new;
};

const getNumberOfSteps = (specificFlowType: SpecificFlowType) => {
  switch (specificFlowType) {
    case SpecificFlowType.login_invite:
      return 1;
    case SpecificFlowType.login_student_existing:
    case SpecificFlowType.login_creator_existing:
      return 1;
    case SpecificFlowType.create_workspace:
      return 3;
    case SpecificFlowType.login_student_new:
    case SpecificFlowType.login_creator_new:
      return 5;
    case SpecificFlowType.login_payment_new:
      return 5;
    case SpecificFlowType.login_vanilla_new:
      return 4;
    default:
      return 4;
  }
};

const extractQueryParams = ({ ob_plan, ob_coupon, ob_period, invite, promo }: Query) => {
  const configurations = {
    plan: PlanType.PRO,
    period: BillingPeriod.ANNUALLY,
    couponCode: ob_coupon || '',
    flow: invite ? OnboardingType.join : OnboardingType.create,
  };

  if (ob_plan && Object.values(PlanType).includes(ob_plan)) {
    configurations.plan = ob_plan;
  }

  if (!!promo && promo === PromoType.STUDENT) {
    configurations.plan = PlanType.STUDENT;
    configurations.flow = OnboardingType.student;
    configurations.period = BillingPeriod.MONTHLY;
  }

  if (!!promo && promo === PromoType.CREATOR) {
    configurations.plan = PlanType.CREATOR;
    configurations.flow = OnboardingType.creator;
    configurations.period = BillingPeriod.MONTHLY;
  }

  if (ob_period && Object.values(BillingPeriod).includes(ob_period)) {
    configurations.period = ob_period;
  }

  return configurations;
};

type OnboardingProviderProps = {
  query: Query;
  firstLogin: boolean;
  numberOfSteps?: number;
  children: React.ReactNode;
  stripe: any;
  checkChargeable: (data: any) => void;
  trackInvitationAccepted: (workspaceId: string) => void;
  isLoginFlow: boolean;
};

const OnboardingProviderFunc: React.ComponentType<OnboardingProviderProps & ConnectedOnboardingContextProps> = ({
  query,
  children,
  stripe,
  checkChargeable,
  goToDashboard,
  goToDashboardWithSearch,
  goToCanvas,
  updateCurrentWorkspace,
  createWorkspace,
  sendInvite,
  fetchWorkspaces,
  firstLogin,
  validateInvite,
  createProject,
  workspaces,
  isLoginFlow,
  trackInvitationAccepted,
  workspaceById,
  account,
  currentWorkspaceID,
  updateWorkspaceName,
  updateWorkspaceImage,
  goToWorkspace,
}) => {
  const dispatch = useDispatch();
  const [trackingEvents] = useTrackingEvents();
  const [isFinalizing, setIsFinalizing] = React.useState(false);
  const { plan, period, couponCode, flow } = extractQueryParams(query);
  const hasFixedPeriod = !!query.ob_period;
  const isFirstSession = firstLogin;
  const firstStep = getFirstStep(flow, isLoginFlow, isFirstSession);
  const { open: openSuccessModal } = useModals(ModalType.SUCCESS);
  const specificFlowType = getSpecificFlowType(query, flow, isLoginFlow, isFirstSession);
  const numberOfSteps = getNumberOfSteps(specificFlowType);
  const nonTemplateWorkspaces = React.useMemo(() => workspaces.filter((workspace) => !workspace.templates), [workspaces.length]);

  const selectableWorkspaceInPayment =
    !!query.choose_workspace ||
    specificFlowType === SpecificFlowType.login_student_existing ||
    specificFlowType === SpecificFlowType.login_creator_existing;

  const [state, actions] = useSmartReducer({
    selectableWorkspace: selectableWorkspaceInPayment,
    usedSignupCoupon: false,
    flow,
    specificFlowType,
    workspaceId: '',
    stepStack: [firstStep],
    createWorkspaceMeta: {},
    personalizeWorkspaceMeta: {},
    paymentMeta: {
      plan,
      couponCode,
      period,
    },
    addCollaboratorMeta: { collaborators: [] },
    joinWorkspaceMeta: {
      role: '',
    },
    numberOfSteps,
    onboardingComplete: false,
    sendingRequests: false,
    justCreatingWorkspace: !isLoginFlow,
    hasFixedPeriod,
  });

  const { stepStack, createWorkspaceMeta, addCollaboratorMeta, paymentMeta, sendingRequests, usedSignupCoupon } = state;
  const { setStepStack, setOnboardingComplete, setSendingRequests } = actions;

  const cache = React.useRef({ stepStack, state, skipped: false });

  cache.current.state = state;

  React.useEffect(() => {
    fetchWorkspaces();
  }, []);

  React.useEffect(() => {
    const usedSignupCoupon = nonTemplateWorkspaces.length === 1 && nonTemplateWorkspaces[0].name === 'Personal';
    actions.setUsedSignupCoupon(usedSignupCoupon);
    if (usedSignupCoupon) {
      updateCurrentWorkspace(nonTemplateWorkspaces[0].id);
    }
  }, [workspaces.length]);

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

  const onCancel = () => {
    goToDashboard();
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
    const inviteSource = query.email ? 'email' : 'link';

    if (!newWorkspaceID) {
      toastNotif.error('Error joining workspace');
    } else {
      await fetchWorkspaces();
      updateCurrentWorkspace(newWorkspaceID);

      goToDashboard();
      trackInvitationAccepted(newWorkspaceID, query.email, inviteSource);
      setOnboardingComplete(true);

      toastNotif.success('Successfully joined workspace');
    }
  };

  const finishCreateOnboarding = async () => {
    if (sendingRequests) return;
    setSendingRequests(true);

    const hasPaymentStep = stepStack.includes(StepID.PAYMENT);

    const name = createWorkspaceMeta.workspaceName;
    const workspaceImage = createWorkspaceMeta.workspaceImage;
    let source;

    if (hasPaymentStep) {
      try {
        source = await checkPayment();
      } catch (e) {
        toast.error('Something went wrong when checking out, please try again later');
        goToDashboard();
        return null;
      }
    }

    let workspace;
    let userWorkspaces: any;

    const selectedWorkspaceID = paymentMeta.selectedWorkspaceId;
    if (selectedWorkspaceID) {
      workspace = workspaceById(selectedWorkspaceID);
    }
    if (!workspace) {
      try {
        if (usedSignupCoupon) {
          workspace = nonTemplateWorkspaces[0];
          updateWorkspaceName(name);
          updateWorkspaceImage(workspaceImage);
        } else {
          workspace = await createWorkspace({ name, image: workspaceImage || undefined });
        }
        updateCurrentWorkspace(workspace.id);
      } catch (e) {
        toastNotif.error('Error creating workspace, please try again later');
        goToDashboard();
        return;
      }
    }

    // This is so we can invite users and update redux, targeting the just created ^ workspace
    try {
      await fetchWorkspaces();
    } catch (e) {
      toastNotif.error('Error getting workspace, please try again later');
      goToDashboard();
      return;
    }

    if (hasPaymentStep) {
      try {
        await handlePayment(workspace.id, source);
      } catch (e) {
        toast.error('Something went wrong when checking out, please try again later');
        goToDashboard();
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

    if (isLoginFlow) {
      trackingEvents.trackOnboardingIdentify({
        name: userName!,
        role,
        email: email!,
        channels,
        teamSize,
        workspaceIDs: userWorkspaces?.allIds,
      });
    }

    if (selectedWorkspaceID) {
      goToWorkspace(selectedWorkspaceID);
      toastNotif.success('Successfully updated workspace');
      setSendingRequests(false);
      return;
    }

    try {
      const { skill_id, diagram } = await createProject(
        workspace.id,
        { name: ONBOARDING_PROJECT_NAME, locales: ['en-US'], platform: PlatformType.ALEXA },
        1
      );

      if (isLoginFlow) {
        if (query.import) {
          goToDashboardWithSearch(`/?import=${query.import}`);
        } else {
          await goToCanvas(skill_id, diagram);
          await Userflow.startFlow(USERFLOW_ONBOARDING_FLOW_ID);
        }
      } else {
        const message = `Your Voiceflow ${state.paymentMeta.plan} subscription has been activated.`;
        goToWorkspace(workspace.id);

        openSuccessModal({ title: 'Payment Successful', message, icon: '/receipt.svg', variant: ButtonVariant.TERTIARY });
      }
      toastNotif.success('Successfully created workspace');
    } catch (error) {
      // if it fails to create a project for the user, go to dashboard
      console.error(error);
      goToDashboard();
    }

    setSendingRequests(false);

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
        return;
      }

      if (isLoginFlow) {
        dispatch(STEP_META[currentStepID].trackStep(cache.current.state, { skip: false }));
      }

      if (workspaceID && isLoginFlow) {
        trackingEvents.trackOnboardingComplete({ skip: false, workspaceID });
      }
    };
    if (isFinalizing && isLastStep) {
      lastStepHandler();
    }
  }, [isFinalizing]);

  React.useEffect(() => {
    if (cache.current.stepStack.length < stepStack.length && isLoginFlow) {
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
      onCancel,
    },
  };

  return <OnboardingContext.Provider value={api}>{children}</OnboardingContext.Provider>;
};

const mapStateToProps = {
  workspaces: Workspace.allWorkspacesSelector,
  workspaceById: Workspace.workspaceByIDSelector,
  account: Account.userSelector,
  firstLogin: Account.isFirstLoginSelector,
  currentWorkspaceID: Workspace.activeWorkspaceIDSelector,
};

const mapDispatchToProps = {
  createWorkspace: Workspace.createWorkspace,
  sendInvite: Workspace.sendInvite,
  goToCanvas: Router.goToCanvas,
  validateInvite: Workspace.validateInvite,
  goToDashboard: Router.goToDashboard,
  goToDashboardWithSearch: Router.goToDashboardWithSearch,
  updateCurrentWorkspace: Workspace.updateCurrentWorkspace,
  fetchWorkspaces: Workspace.fetchWorkspaces,
  createProject: Workspace.createProject,
  updateWorkspaceName: Workspace.updateWorkspaceName,
  updateWorkspaceImage: Workspace.updateWorkspaceImage,
  goToWorkspace: Router.goToWorkspace,
  trackInvitationAccepted: Tracking.trackInvitationAccepted,
};

type ConnectedOnboardingContextProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export const OnboardingProvider: any = compose(withStripe, connect(mapStateToProps, mapDispatchToProps))(OnboardingProviderFunc);
