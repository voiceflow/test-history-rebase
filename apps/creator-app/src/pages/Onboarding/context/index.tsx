import { datadogRum } from '@datadog/browser-rum';
import type { Nullable } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { getCookieByName, toast, useSmartReducerV2 } from '@voiceflow/ui';
import queryString from 'query-string';
import React from 'react';
import { Redirect, useLocation } from 'react-router-dom';

import { Path } from '@/config/routes';
import { COUPON_QUERY_PARAM } from '@/constants/payment';
import * as Account from '@/ducks/account';
import * as Project from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, useSelector, useStore, useTrackingEvents } from '@/hooks';
import { useFeature } from '@/hooks/feature.hook';

import { OnboardingType } from '../onboardingType.enum';
import { StepID } from '../stepID.enum';
import { STEP_META } from '../stepMeta';
import type { UTMCookieType } from './constants';
import { STEPS_BY_FLOW, UTM_COOKIE_NAME } from './constants';
import type { OnboardingContextAPI, OnboardingContextState, OnboardingProviderProps } from './types';

export const OnboardingContext = React.createContext<OnboardingContextAPI | null>(null);

export const useOnboardingContext = () => {
  const context = React.useContext(OnboardingContext);

  if (!context) {
    throw new Error('useOnboardingContext must be used within a OnboardingProvider');
  }

  return context;
};

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ query, children }) => {
  const store = useStore();
  const location = useLocation();
  const search = queryString.parse(location.search);
  const UTMCookie: UTMCookieType = getCookieByName(UTM_COOKIE_NAME) || {};

  const workspaces = useSelector(WorkspaceV2.allWorkspacesSelector);
  const getWorkspaceByID = useSelector(WorkspaceV2.getWorkspaceByIDSelector);
  const account = useSelector(Account.userSelector);
  const createWorkspace = useDispatch(WorkspaceV2.createWorkspace);
  const acceptInvite = useDispatch(WorkspaceV2.acceptInvite);
  const goToDashboard = useDispatch(Router.goToDashboard);
  const goToProjectCanvas = useDispatch(Router.goToProjectCanvas);
  const goToDashboardWithSearch = useDispatch(Router.goToDashboardWithSearch);
  const setActiveWorkspace = useDispatch(WorkspaceV2.setActive);
  const createProject = useDispatch(Project.createProject);
  const isKnowledgeBaseEnabled = useFeature(Realtime.FeatureFlag.KNOWLEDGE_BASE);

  const [trackingEvents] = useTrackingEvents();

  const flow = query.invite ? OnboardingType.join : OnboardingType.create;

  const steps = STEPS_BY_FLOW[flow];

  const [state, stateAPI] = useSmartReducerV2<OnboardingContextState>({
    steps,
    flow,
    stepStack: [steps[0]],
    sendingRequests: false,
    createWorkspaceMeta: {
      workspaceName: '',
      workspaceImage: '',
    },
    personalizeWorkspaceMeta: {
      selfReportedAttribution: '',
      channels: [],
      teamSize: '',
      useCase: '',
      workWithDevelopers: null,
    },
    joinWorkspaceMeta: {
      role: '',
    },
  });

  const { stepStack, createWorkspaceMeta, sendingRequests } = state;

  const handleCreateWorkspace = async () => {
    try {
      const { workspaceName, workspaceImage } = createWorkspaceMeta;
      const workspace = await createWorkspace({ name: workspaceName, image: workspaceImage ?? undefined });

      setActiveWorkspace(workspace.id);

      const { useCase, teamSize, workWithDevelopers, selfReportedAttribution } = state.personalizeWorkspaceMeta;

      const UTMCookieValues = UTMCookie?.parameters;

      trackingEvents.trackOnboardingIdentify({
        email: account.email,
        source: (search.utm_source || UTMCookieValues?.utm_source) as Nullable<string>,
        medium: (search.utm_medium || UTMCookieValues?.utm_medium) as Nullable<string>,
        content: (search.utm_content || UTMCookieValues?.utm_content) as Nullable<string>,
        campaign: (search.utm_campaign || UTMCookieValues?.utm_campaign) as Nullable<string>,
        term: (search.utm_term || UTMCookieValues?.utm_term) as Nullable<string>,
        useCase,
        teamSize,
        workWithDevelopers,
        creatorID: account.creator_id,
        selfReportedAttribution,
      });

      return workspace;
    } catch (error) {
      toast.error('Error creating workspace, please try again later');
      throw error;
    }
  };

  const handleCreateInitialProject = async () => {
    const { versionID } = await createProject({
      nlu: null,
      project: {
        name: null,
        image: null,
        listID: null,
        members: [],
        locales: Platform.Voiceflow.CONFIG.types[Platform.Constants.ProjectType.CHAT].project.locale.defaultLocales,
        aiAssistSettings: { aiPlayground: true },
      },
      modality: {
        type: Platform.Constants.ProjectType.CHAT,
        platform: Platform.Constants.PlatformType.VOICEFLOW,
      },
      tracking: { onboarding: true },
      templateTag: `onboarding:${Platform.Constants.ProjectType.CHAT}`,
    });

    return { versionID };
  };

  const finishCreateOnboarding = async () => {
    const workspace = await handleCreateWorkspace();

    if (query.import) {
      goToDashboardWithSearch(`/?import=${query.import}`);
    } else {
      const result = await handleCreateInitialProject();

      const coupon = search[COUPON_QUERY_PARAM] as Nullable<string>;

      if (coupon) {
        goToDashboardWithSearch(`/?${COUPON_QUERY_PARAM}=${coupon}`);
      } else if (isKnowledgeBaseEnabled) {
        goToProjectCanvas({ versionID: result.versionID });
      } else {
        goToDashboard();
      }
    }

    toast.success('Successfully created workspace');

    return workspace.id;
  };

  const finishJoiningWorkspace = async () => {
    await acceptInvite(query.invite || '', {
      role: state.joinWorkspaceMeta.role,
      email: query.email ?? account.email ?? '',
      source: query.email ? 'email' : 'link',
    });

    goToDashboard();
  };

  const joinOrCreateWorkspace = async (currentStepID: StepID) => {
    if (state.sendingRequests) return null;

    stateAPI.sendingRequests.set(true);

    try {
      const workspaceID =
        currentStepID === StepID.CREATE_WORKSPACE ? await finishCreateOnboarding() : await finishJoiningWorkspace();

      if (workspaceID) {
        trackingEvents.trackOnboardingComplete({
          skip: false,
          workspaceID,
          organizationID: getWorkspaceByID({ id: workspaceID })?.organizationID ?? null,
          cohort: isKnowledgeBaseEnabled ? 'A' : 'B',
        });
        stateAPI.sendingRequests.set(false);
      }

      return workspaceID;
    } catch (error) {
      stateAPI.sendingRequests.set(false);
      datadogRum.addError(error);
      // if it fails to create a project or workspace for the user, go to dashboard
      goToDashboard();

      return null;
    }
  };

  const stepBack = () => {
    if (stepStack.length > 1) {
      const [, ...newStepStack] = stepStack;
      stateAPI.stepStack.set(newStepStack);
    }
  };

  const stepForward = async ({ skip }: { skip: boolean } = { skip: false }) => {
    const [currentStepID] = stepStack;
    store.dispatch(STEP_META[currentStepID].trackStep(state, { skip }));

    const nextStepID = state.steps[stepStack.length];

    // If we're on the last step, finish the onboarding
    if (!nextStepID) {
      await joinOrCreateWorkspace(currentStepID);
    } else if (!stepStack.includes(nextStepID)) {
      stateAPI.stepStack.set([nextStepID, ...stepStack]);
    }
  };

  const api: OnboardingContextAPI = {
    state,
    stateAPI,
    getCurrentStepID: () => stepStack[0],
    stepForward,
    stepBack,
  };

  const alreadyHasWorkspace = workspaces.length > 0;

  const redirectToDashboard = !sendingRequests && alreadyHasWorkspace;
  return redirectToDashboard ? (
    <Redirect to={Path.DASHBOARD} />
  ) : (
    <OnboardingContext.Provider value={api}>{children}</OnboardingContext.Provider>
  );
};
