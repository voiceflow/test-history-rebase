import { Constants } from '@voiceflow/general-types';
import { BillingPeriod, PlanType, PromoType, UserRole } from '@voiceflow/internal';
import { ButtonVariant, toast } from '@voiceflow/ui';
import _constant from 'lodash/constant';
import queryString from 'query-string';
import React from 'react';
import { useDispatch as useReduxDispatch } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';

import { receiptGraphic } from '@/assets';
import client from '@/client';
import { IS_PRIVATE_CLOUD, USERFLOW_ONBOARDING_FLOW_ID } from '@/config';
import { Path } from '@/config/routes';
import { ModalType } from '@/constants';
import * as Account from '@/ducks/account';
import * as Project from '@/ducks/project';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as Tracking from '@/ducks/tracking';
import * as Workspace from '@/ducks/workspace';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { withStripe } from '@/hocs';
import { useDispatch, useModals, useSelector, useSmartReducer, useTrackingEvents } from '@/hooks';
import { asyncForEach } from '@/utils/array';
import * as Sentry from '@/vendors/sentry';
import * as Userflow from '@/vendors/userflow';

import { SELECTABLE_WORKSPACE_SPECIFIC_FLOW_TYPES, STEP_META, StepID } from '../constants';
import { CollaboratorType } from '../types';
import {
  OnboardingContextActions,
  OnboardingContextProps,
  OnboardingContextState,
  OnboardingProviderProps,
  OnboardingType,
  SpecificFlowType,
} from './types';
import * as Utils from './utils';

export const OnboardingContext = React.createContext<OnboardingContextProps>({
  actions: {
    stepBack: _constant(null),
    stepForward: _constant(null),
    closeOnboarding: _constant(null),
    setCreateWorkspaceMeta: _constant(null),
    setPersonalizeWorkspaceMeta: _constant(null),
    setPaymentMeta: _constant(null),
    setJoinWorkspaceMeta: _constant(null),
    setSelectChannelMeta: _constant(null),
    setAddCollaboratorMeta: _constant(null),
    finishCreateOnboarding: _constant(null),
    finishJoiningWorkspace: _constant(null),
    onCancel: _constant(null),
    getNumberOfEditors: _constant(0),
  },
  state: {
    selectableWorkspace: false,
    specificFlowType: SpecificFlowType.create_workspace,
    flow: OnboardingType.create,
    stepStack: [],
    currentStepID: StepID?.CREATE_WORKSPACE,
    numberOfSteps: 0,
    createWorkspaceMeta: { workspaceImage: 'string', workspaceName: 'string' },
    personalizeWorkspaceMeta: { channels: [], role: '', teamSize: '' },
    paymentMeta: {
      period: BillingPeriod.MONTHLY,
      couponCode: '',
      selectedWorkspaceId: '',
    },
    addCollaboratorMeta: { collaborators: [] },
    joinWorkspaceMeta: {
      role: '',
    },
    selectChannelMeta: {
      channel: Constants.PlatformType.ALEXA,
    },
    sendingRequests: false,
    workspaceId: '',
    justCreatingWorkspace: false,
    hasFixedPeriod: false,
    hasWorkspaces: false,
  },
});

export const { Consumer: OnboardingConsumer } = OnboardingContext;

const UnconnectedOnboardingProvider: React.FC<OnboardingProviderProps> = ({
  query,
  children,
  stripe,
  checkChargeable,
  isLoginFlow, // This boolean represents if the user hits the onboarding flow from a link/new signup, or from the dashboard 'create workspace' button
}) => {
  const dispatch = useReduxDispatch();
  const location = useLocation();
  const search = queryString.parse(location.search);

  const workspaces = useSelector(WorkspaceV2.allWorkspacesSelector);
  const getWorkspaceByID = useSelector(WorkspaceV2.getWorkspaceByIDSelector);
  const account = useSelector(Account.userSelector);
  const firstLogin = useSelector(Account.isFirstLoginSelector);
  const currentWorkspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const hasTemplateWorkspace = useSelector(WorkspaceV2.hasTemplatesWorkspaceSelector);

  const createWorkspace = useDispatch(Workspace.createWorkspace);
  const sendInvite = useDispatch(Workspace.sendInviteToActiveWorkspace);
  const goToCanvas = useDispatch(Router.goToCanvas);
  const acceptInvite = useDispatch(Workspace.acceptInvite);
  const goToDashboard = useDispatch(Router.goToDashboard);
  const goToDashboardWithSearch = useDispatch(Router.goToDashboardWithSearch);
  const setActiveWorkspaceID = useDispatch(Session.setActiveWorkspaceID);
  const loadWorkspaces = useDispatch(Workspace.loadWorkspaces);
  const updateWorkspaceName = useDispatch(Workspace.updateActiveWorkspaceName);
  const updateWorkspaceImage = useDispatch(Workspace.updateActiveWorkspaceImage);
  const goToWorkspace = useDispatch(Router.goToWorkspace);
  const trackInvitationAccepted = useDispatch(Tracking.trackInvitationAccepted);
  const createProject = useDispatch(Project.createProject);

  const [trackingEvents] = useTrackingEvents();
  const [isFinalizing, setIsFinalizing] = React.useState(false);
  const hasFixedPeriod = !!query.ob_period;
  const { plan, period, couponCode, flow, seats } = Utils.extractQueryParams(query);
  const isFirstSession = firstLogin;
  const { open: openSuccessModal } = useModals(ModalType.SUCCESS);

  // if the user has existing workspaces they are owners of
  const hasWorkspaces = React.useMemo(
    () =>
      !!workspaces.filter(
        (workspace) =>
          workspace.members?.some((member) => member.creator_id === account.creator_id && member.role === UserRole.ADMIN) &&
          // to fix the issue when the payment step is shown after coupon code was used
          // we are creating workspace (name = Personal) during the signup if the coupon code is used
          (!isLoginFlow || !(workspace.name === 'Personal' && workspace.plan !== PlanType.STARTER))
      ).length,
    [workspaces.length, account.creator_id, isLoginFlow]
  );

  const isAdminOfEnterprisePlan = React.useMemo(
    () =>
      workspaces.some((workspace) => {
        const isEnterpriseWorkspace = workspace.plan === PlanType.ENTERPRISE;

        if (!isEnterpriseWorkspace) return false;

        return workspace.members?.some((member) => member.creator_id === account.creator_id && member.role === UserRole.ADMIN);
      }),
    [workspaces, account.creator_id]
  );

  const specificFlowType = Utils.getSpecificFlowType(query, flow, isLoginFlow, isFirstSession);
  const nonTemplateWorkspaces = React.useMemo(() => workspaces.filter((workspace) => !workspace.templates), [workspaces.length]);
  const numberOfSteps = Utils.getNumberOfSteps({
    specificFlowType,
    hasPresetSeats: !!seats,
    hasWorkspaces,
    isAdminOfEnterprisePlan,
  });
  const firstStep = Utils.getFirstStep({
    flow,
    isLoginFlow,
    isFirstSession,
    hasPresetSeats: !!seats,
  });
  const selectableWorkspaceInPayment = !!query.choose_workspace || SELECTABLE_WORKSPACE_SPECIFIC_FLOW_TYPES.includes(specificFlowType);

  const [state, actions] = useSmartReducer({
    selectableWorkspace: selectableWorkspaceInPayment,
    specificFlowType,
    flow,
    stepStack: [firstStep],
    numberOfSteps,
    createWorkspaceMeta: {},
    personalizeWorkspaceMeta: {},
    paymentMeta: {
      plan,
      couponCode,
      period,
      seats,
    },
    addCollaboratorMeta: { collaborators: [] },
    joinWorkspaceMeta: {
      role: '',
    },
    selectChannelMeta: {
      channel: Constants.PlatformType.ALEXA,
    },
    sendingRequests: false,
    workspaceId: '',
    justCreatingWorkspace: !isLoginFlow,
    hasFixedPeriod,
    usedSignupCoupon: false,
    hasWorkspaces,
  });

  const { stepStack, createWorkspaceMeta, addCollaboratorMeta, paymentMeta, sendingRequests, usedSignupCoupon } = state;
  const { setStepStack, setSendingRequests } = actions;

  const cache = React.useRef({ stepStack, state, skipped: false });

  cache.current.state = state;

  React.useEffect(() => {
    const usedSignupCoupon = nonTemplateWorkspaces.length === 1 && nonTemplateWorkspaces[0].name === 'Personal';
    actions.setUsedSignupCoupon(usedSignupCoupon);
    if (usedSignupCoupon) {
      setActiveWorkspaceID(nonTemplateWorkspaces[0].id);
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
    const { source } = stripeSource;
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

  const getNumberOfEditors = () => {
    const numberOfEditors = Utils.getNumberOfEditorSeats(addCollaboratorMeta.collaborators);

    return Math.max(paymentMeta.seats, numberOfEditors);
  };

  const handlePayment = async (workspaceID: string, source: any) => {
    const { plan, period, couponCode, seats } = paymentMeta;

    await client.workspace.checkout(workspaceID, {
      plan,
      seats,
      period,
      coupon: couponCode || undefined,
      source_id: source?.id,
    });
  };

  const finishJoiningWorkspace = async () => {
    const newWorkspaceID = await acceptInvite(query.invite || '');
    const inviteSource = query.email ? 'email' : 'link';

    if (!newWorkspaceID) {
      toast.error('Error joining workspace');
    } else {
      await loadWorkspaces();

      goToWorkspace(newWorkspaceID);
      trackInvitationAccepted(newWorkspaceID, query.email, inviteSource);

      toast.success('Successfully joined workspace');
    }
  };

  const finishCreateOnboarding = async () => {
    if (sendingRequests) return;
    setSendingRequests(true);

    const hasPaymentStep = stepStack.includes(StepID.PAYMENT);

    const name = createWorkspaceMeta.workspaceName;
    const { workspaceImage } = createWorkspaceMeta;
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

    const selectedWorkspaceID = paymentMeta.selectedWorkspaceId;
    if (selectedWorkspaceID) {
      workspace = getWorkspaceByID(selectedWorkspaceID);
    }
    if (!workspace) {
      try {
        if (usedSignupCoupon) {
          [workspace] = nonTemplateWorkspaces;
          updateWorkspaceName(name);
          updateWorkspaceImage(workspaceImage);
        } else {
          workspace = await createWorkspace({ name, image: workspaceImage || undefined });
        }

        setActiveWorkspaceID(workspace.id);
      } catch (e) {
        toast.error('Error creating workspace, please try again later');
        goToDashboard();
        return;
      }
    }

    // This is so we can invite users and update redux, targeting the just created ^ workspace
    try {
      await loadWorkspaces();
    } catch (e) {
      toast.error('Error getting workspace, please try again later');
      goToDashboard();
      return;
    }

    if (hasPaymentStep) {
      try {
        await handlePayment(workspace.id, source);
      } catch (err) {
        toast.error(err?.data || err?.message || err?.data?.data);
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
        toast.error(`Problem inviting ${email}, please try again later`);
      }
    });

    const { role, channels, teamSize } = state.personalizeWorkspaceMeta;
    const { email, name: userName } = account;

    if (isLoginFlow) {
      trackingEvents.trackOnboardingIdentify({
        name: userName!,
        role,
        email: email!,
        channels,
        teamSize,
        workspaceIDs: [],
      });
    }

    if (selectedWorkspaceID) {
      goToWorkspace(selectedWorkspaceID);
      toast.success('Successfully updated workspace');
      setSendingRequests(false);
      return;
    }

    try {
      if (isLoginFlow) {
        let templateTag = `onboarding:${state.selectChannelMeta.channel}`;
        const platform = state.selectChannelMeta.channel;

        if (platform === Constants.PlatformType.GENERAL) {
          templateTag = `onboarding:custom_assistant`;
        } else if (platform === Constants.PlatformType.ALEXA) {
          templateTag = 'onboarding:alexa_assistant';
        } else if (platform === Constants.PlatformType.GOOGLE) {
          templateTag = 'onboarding:google_assistant';
        }

        if (query.import) {
          goToDashboardWithSearch(`/?import=${query.import}`);
        } else {
          const { versionID } = await createProject({ platform: state.selectChannelMeta.channel as Constants.PlatformType }, templateTag);
          goToCanvas(versionID!);
          await Userflow.startFlow(USERFLOW_ONBOARDING_FLOW_ID);
        }
      } else {
        goToWorkspace(workspace.id);

        if (!IS_PRIVATE_CLOUD && hasWorkspaces && !isAdminOfEnterprisePlan) {
          const message = `Your Voiceflow ${state.paymentMeta.plan} subscription has been activated.`;

          openSuccessModal({ title: 'Payment Successful', message, icon: receiptGraphic, variant: ButtonVariant.TERTIARY });
        }
      }
      toast.success('Successfully created workspace');
    } catch (error) {
      // if it fails to create a project for the user, go to dashboard
      Sentry.error(error);
      goToDashboard();
    }

    setSendingRequests(false);

    return workspace;
  };

  const handleLastStep = async (currentStepID: StepID) => {
    let workspaceId: string | null = null;

    if (currentStepID === StepID.ADD_COLLABORATORS || currentStepID === StepID.PAYMENT || currentStepID === StepID.SELECT_CHANNEL) {
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
        toast.error('Sorry, something went wrong, try again in a bit.');
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

  const api: { state: OnboardingContextState; actions: OnboardingContextActions } = {
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
      onCancel: goToDashboard,
      getNumberOfEditors,
    },
  };

  const templateWorkspacesLength = hasTemplateWorkspace ? 1 : 0;
  const alreadyHasFreeWorkspace = workspaces.length - templateWorkspacesLength > 0;

  return isLoginFlow && !sendingRequests && alreadyHasFreeWorkspace && search.promo !== PromoType.STUDENT ? (
    <Redirect to={Path.DASHBOARD} />
  ) : (
    <OnboardingContext.Provider value={api}>{children}</OnboardingContext.Provider>
  );
};

export const OnboardingProvider = withStripe(UnconnectedOnboardingProvider) as React.FC<Omit<OnboardingProviderProps, 'stripe' | 'checkChargeable'>>;
