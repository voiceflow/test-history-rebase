import { datadogRum } from '@datadog/browser-rum';
import * as stripeJs from '@stripe/stripe-js';
import { Nullable, Utils } from '@voiceflow/common';
import { BillingPeriod, PlanType, PromoType } from '@voiceflow/internal';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { ButtonVariant, toast } from '@voiceflow/ui';
import _constant from 'lodash/constant';
import * as Normal from 'normal-store';
import queryString from 'query-string';
import React from 'react';
import { Redirect, useLocation } from 'react-router-dom';

import { receiptGraphic } from '@/assets';
import { IS_PRIVATE_CLOUD } from '@/config';
import { Path } from '@/config/routes';
import * as Payment from '@/contexts/PaymentContext';
import * as Account from '@/ducks/account';
import * as Project from '@/ducks/project';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as Tracking from '@/ducks/tracking';
import * as Workspace from '@/ducks/workspace';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { withStripe } from '@/hocs/withStripe';
import { useDispatch, useFeature, useSelector, useSmartReducer, useStore, useSyncDispatch, useTrackingEvents } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import { useGetAIAssistSettings } from '@/ModalsV2/modals/Disclaimer/hooks/aiPlayground';
import { getErrorMessage } from '@/utils/error';
import { isAdminUserRole, isEditorUserRole } from '@/utils/role';

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
import * as OnboardingUtils from './utils';

const UPGRADING_WORKSPACE_SPECIFIC_FLOWS = new Set([
  SpecificFlowType.existing_user_general_upgrade,
  SpecificFlowType.login_creator_existing,
  SpecificFlowType.login_student_existing,
]);

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
    personalizeWorkspaceMeta: { channels: [], role: '', teamSize: '', company: '', projectType: Platform.Constants.ProjectType.CHAT, teamGoal: '' },
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
      platform: Platform.Constants.PlatformType.ALEXA,
      projectType: Platform.Constants.ProjectType.VOICE,
    },
    sendingRequests: false,
    workspaceId: '',
    justCreatingWorkspace: false,
    hasFixedPeriod: false,
    hasWorkspaces: false,
    upgradingAWorkspace: false,
  },
});

export const { Consumer: OnboardingConsumer } = OnboardingContext;

const UnconnectedOnboardingProvider: React.FC<React.PropsWithChildren<OnboardingProviderProps>> = ({
  query,
  children,
  isLoginFlow, // This boolean represents if the user hits the onboarding flow from a link/new signup, or from the dashboard 'create workspace' button
}) => {
  const store = useStore();
  const location = useLocation();
  const search = queryString.parse(location.search);
  const workspaces = useSelector(WorkspaceV2.allWorkspacesSelector);
  const getWorkspaceByID = useSelector(WorkspaceV2.getWorkspaceByIDSelector);
  const account = useSelector(Account.userSelector);
  const firstLogin = useSelector(Account.isFirstLoginSelector);
  const currentWorkspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const isLoggedIn = useSelector(Account.isLoggedInSelector);
  const paymentAPI = Payment.usePaymentAPI();
  const checkoutWorkspace = useDispatch(Workspace.checkout);
  const createWorkspace = useDispatch(Workspace.createWorkspace);
  const sendInvite = useDispatch(Workspace.sendInviteToActiveWorkspace);
  const goToDomain = useDispatch(Router.goToDomain);
  const acceptInvite = useDispatch(Workspace.acceptInvite);
  const goToDashboard = useDispatch(Router.goToDashboard);
  const goToKnowledgeBase = useDispatch(Router.goToKnowledgeBase);
  const goToDashboardWithSearch = useDispatch(Router.goToDashboardWithSearch);
  const setActiveWorkspace = useDispatch(Workspace.setActive);
  const updateWorkspaceName = useDispatch(Workspace.updateActiveWorkspaceName);
  const goToWorkspace = useDispatch(Router.goToWorkspace);
  const trackInvitationAccepted = useDispatch(Tracking.trackInvitationAccepted);
  const changeSeats = useSyncDispatch(Realtime.workspace.changeSeats);
  const createProject = useDispatch(Project.createProject);
  const { isEnabled: isOnboardingDashboardDropEnabled } = useFeature(Realtime.FeatureFlag.ONBOARDING_DASHBOARD_DROP);
  const { isEnabled: isKnowledgeBaseEnabled } = useFeature(Realtime.FeatureFlag.KNOWLEDGE_BASE);

  const getAIAssistSettings = useGetAIAssistSettings();
  const [trackingEvents] = useTrackingEvents();
  const [isFinalizing, setIsFinalizing] = React.useState(false);
  const hasFixedPeriod = !!query.ob_period;
  const { plan, period, couponCode, flow, seats } = OnboardingUtils.extractQueryParams(query, isLoggedIn);
  const isFirstSession = firstLogin;
  const successModal = ModalsV2.useModal(ModalsV2.Success);

  // if the user has existing workspaces they are owners of
  const hasWorkspaces = React.useMemo(
    () =>
      workspaces.some(
        (workspace) =>
          Normal.denormalize(workspace.members).some((member) => member.creator_id === account.creator_id && isAdminUserRole(member.role)) &&
          // to fix the issue when the payment step is shown after coupon code was used
          // we are creating workspace (name = Personal) during the signup if the coupon code is used
          (!isLoginFlow || !(workspace.name === 'Personal' && workspace.plan !== PlanType.STARTER))
      ),
    [workspaces.length, account.creator_id, isLoginFlow]
  );

  const isAdminOfEnterprisePlan = React.useMemo(
    () =>
      workspaces.some((workspace) => {
        if (workspace.plan !== PlanType.ENTERPRISE) return false;

        return Normal.denormalize(workspace.members).some((member) => member.creator_id === account.creator_id && isAdminUserRole(member.role));
      }),
    [workspaces, account.creator_id]
  );

  const specificFlowType = OnboardingUtils.getSpecificFlowType(query, flow, isLoginFlow, isFirstSession);
  const upgradingAWorkspace = UPGRADING_WORKSPACE_SPECIFIC_FLOWS.has(specificFlowType);
  const numberOfSteps = OnboardingUtils.getNumberOfSteps({
    specificFlowType,
    hasPresetSeats: !!seats,
    hasWorkspaces,
    isAdminOfEnterprisePlan,
  });

  const firstStep = OnboardingUtils.getFirstStep({
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
      platform: Platform.Constants.PlatformType.ALEXA,
      projectType: Platform.Constants.ProjectType.VOICE,
    },
    sendingRequests: false,
    workspaceId: '',
    justCreatingWorkspace: !isLoginFlow,
    hasFixedPeriod,
    usedSignupCoupon: false,
    hasWorkspaces,
    upgradingAWorkspace,
  });

  const { stepStack, createWorkspaceMeta, addCollaboratorMeta, paymentMeta, sendingRequests, usedSignupCoupon } = state;
  const { setStepStack, setSendingRequests } = actions;

  const cache = React.useRef({ stepStack, state, skipped: false });

  cache.current.state = state;

  React.useEffect(() => {
    const usedSignupCoupon = workspaces.length === 1 && workspaces[0].name === 'Personal';

    actions.setUsedSignupCoupon(usedSignupCoupon);

    if (usedSignupCoupon) {
      setActiveWorkspace(workspaces[0].id);
    }
  }, [workspaces.length]);

  const stepBack = () => {
    if (stepStack.length > 1) {
      const [, ...newStepStack] = stepStack;
      setStepStack([...newStepStack]);
    }
  };

  const checkPayment = async () => paymentAPI.createSource();

  const getNumberOfEditors = () => {
    const numberOfEditors = OnboardingUtils.getNumberOfEditorSeats(addCollaboratorMeta.collaborators);

    return Math.max(paymentMeta.seats, numberOfEditors);
  };

  const handlePayment = async (workspaceID: string, source: stripeJs.Source) => {
    const { plan, period, couponCode, seats } = paymentMeta;

    await checkoutWorkspace({
      plan,
      seats,
      period,
      coupon: couponCode || undefined,
      sourceID: source?.id ?? '',
      workspaceID,
    });
  };

  const finishJoiningWorkspace = async () => {
    const newWorkspaceID = await acceptInvite(query.invite || '');

    const { role } = state.personalizeWorkspaceMeta;

    if (!newWorkspaceID) {
      toast.error('Error joining workspace');
    } else {
      goToWorkspace(newWorkspaceID);

      trackInvitationAccepted({
        role,
        email: query.email ?? account.email ?? '',
        source: query.email ? 'email' : 'link',
        workspaceID: newWorkspaceID,
        organizationID: getWorkspaceByID({ id: newWorkspaceID })?.organizationID ?? '',
      });
      toast.success('Successfully joined workspace');
    }
  };

  const finishCreateOnboarding = async () => {
    if (sendingRequests) return;
    setSendingRequests(true);

    const hasPaymentStep = stepStack.includes(StepID.PAYMENT);

    const name = createWorkspaceMeta.workspaceName;
    const { workspaceImage } = createWorkspaceMeta;
    let source!: stripeJs.Source;

    if (hasPaymentStep) {
      try {
        source = await checkPayment();
      } catch (e) {
        toast.error('Something went wrong when checking out, please try again later');
        goToDashboard();

        return null;
      }
    }

    let workspace: Realtime.Workspace | null = null;

    const selectedWorkspaceID = paymentMeta.selectedWorkspaceId as string | null;

    if (selectedWorkspaceID) {
      workspace = getWorkspaceByID({ id: selectedWorkspaceID });
    }
    if (!workspace) {
      try {
        if (usedSignupCoupon) {
          [workspace] = workspaces;
          updateWorkspaceName(name);
        } else {
          workspace = await createWorkspace({ name, image: workspaceImage || undefined });
        }

        setActiveWorkspace(workspace.id);
      } catch (e) {
        toast.error('Error creating workspace, please try again later');
        goToDashboard();
        return;
      }
    }

    if (hasPaymentStep) {
      try {
        await handlePayment(workspace.id, source);
      } catch (err) {
        toast.error(getErrorMessage(err));
        goToDashboard();

        return null;
      }
    }
    const teamMembers: CollaboratorType[] = addCollaboratorMeta.collaborators.slice(1, addCollaboratorMeta.length);

    const editors = addCollaboratorMeta.collaborators.filter(({ permission }: CollaboratorType) => isEditorUserRole(permission));

    if (!hasPaymentStep && editors.length > 1) {
      await changeSeats({
        workspaceID: workspace.id,
        seats: editors.length,
        schedule: false,
      });
    }

    await Utils.array.asyncForEach(teamMembers, async (member: CollaboratorType) => {
      const { email, permission } = member;

      try {
        await sendInvite({ email, role: permission, showToast: false });
      } catch (e) {
        toast.error(`Problem inviting ${email}, please try again later`);
      }
    });

    const { role, company, teamSize, teamGoal, creatingFor } = state.personalizeWorkspaceMeta;

    if (isLoginFlow) {
      trackingEvents.trackOnboardingIdentify({
        role,
        email: account.email,
        source: search.utm_source as Nullable<string>,
        medium: search.utm_medium as Nullable<string>,
        content: search.utm_content as Nullable<string>,
        company,
        campaign: search.utm_campaign as Nullable<string>,
        modality: creatingFor,
        teamSize,
        teamGoal,
        creatorID: account.creator_id,
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
        if (query.import) {
          goToDashboardWithSearch(`/?import=${query.import}`);
        } else {
          const { versionID } = await createProject({
            nluType: Platform.Constants.NLUType.VOICEFLOW,
            platform: Platform.Constants.PlatformType.VOICEFLOW,

            templateTag: `onboarding:${Platform.Constants.ProjectType.CHAT}`,
            projectType: Platform.Constants.ProjectType.CHAT,
            aiAssistSettings: await getAIAssistSettings({ disclaimer: false }),
            tracking: {
              language: 'English (en-US)',
              onboarding: true,
            },
          });

          // eslint-disable-next-line max-depth
          if (!isOnboardingDashboardDropEnabled) {
            // eslint-disable-next-line max-depth
            if (isKnowledgeBaseEnabled) {
              goToKnowledgeBase(versionID);
            } else {
              goToDomain({ versionID });
            }
          }
        }
      } else {
        goToWorkspace(workspace.id);

        if (!IS_PRIVATE_CLOUD && hasWorkspaces && !isAdminOfEnterprisePlan) {
          const message = `Your Voiceflow ${state.paymentMeta.plan} subscription has been activated.`;

          successModal.openVoid({ header: 'Payment Successful', message, icon: receiptGraphic, buttonVariant: ButtonVariant.TERTIARY });
        }
      }
      toast.success('Successfully created workspace');
    } catch (error) {
      // if it fails to create a project for the user, go to dashboard
      datadogRum.addError(error);
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
    } else if (stepID === null) {
      goToDashboard();
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
        store.dispatch(STEP_META[currentStepID].trackStep(cache.current.state, { skip: false }));
      }

      if (workspaceID && isLoginFlow) {
        trackingEvents.trackOnboardingComplete({
          skip: false,
          workspaceID,
          organizationID: getWorkspaceByID({ id: workspaceID })?.organizationID ?? null,
          cohort: isOnboardingDashboardDropEnabled || isKnowledgeBaseEnabled ? 'A' : 'B',
        });
      }
    };
    if (isFinalizing && isLastStep) {
      lastStepHandler();
    }
  }, [isFinalizing]);

  React.useEffect(() => {
    if (cache.current.stepStack.length < stepStack.length && isLoginFlow) {
      const prevStepID: StepID = cache.current.stepStack[0];

      store.dispatch(STEP_META[prevStepID].trackStep(cache.current.state, { skip: cache.current.skipped }));
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

  const alreadyHasFreeWorkspace = workspaces.length > 0;

  const redirectToDashboard =
    isLoginFlow &&
    !sendingRequests &&
    alreadyHasFreeWorkspace &&
    search.promo !== PromoType.STUDENT &&
    search.promo !== PromoType.CREATOR &&
    !search.ob_payment;
  return redirectToDashboard ? <Redirect to={Path.DASHBOARD} /> : <OnboardingContext.Provider value={api}>{children}</OnboardingContext.Provider>;
};

export const OnboardingProvider = withStripe(UnconnectedOnboardingProvider) as React.FC<React.PropsWithChildren<OnboardingProviderProps>>;
