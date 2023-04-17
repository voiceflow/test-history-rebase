import * as Platform from '@voiceflow/platform-config';
import React from 'react';

import * as Tracking from '@/ducks/tracking';
import { OnboardingContextState, SpecificFlowType } from '@/pages/Onboarding/context/types';
import { SyncThunk } from '@/store/types';

import { CreatingForType, TeamGoalType, TeamSizeType } from './types';

export enum StepID {
  WELCOME = 'welcome',
  CREATE_WORKSPACE = 'create_workspace',
  PERSONALIZE_WORKSPACE = 'personalize_workspace',
  ADD_COLLABORATORS = 'add_collaborators',
  PAYMENT = 'payment',
  JOIN_WORKSPACE = 'join_workspace',
  SELECT_CHANNEL = 'select_channel',
}

export const CREATING_FOR_OPTIONS = [
  { id: CreatingForType.CHAT, label: 'Chat' },
  { id: CreatingForType.VOICE, label: 'Voice' },
  { id: CreatingForType.BOTH, label: 'Both' },
];

export const TEAM_GOAL_OPTIONS = [
  { id: TeamGoalType.HANDOFF, label: 'Design & Handoff' },
  { id: TeamGoalType.PUBLISH, label: 'Build & Publish' },
];

export const TEAM_SIZE_OPTIONS = [
  { id: TeamSizeType.INDIVIDUAL, label: 'Just me' },
  { id: TeamSizeType.SMALL, label: 'Small team (2-5)' },
  { id: TeamSizeType.LARGE, label: 'Large team (5+)' },
];

export const getCreatingForProjectType: Record<CreatingForType, Platform.Constants.ProjectType> = {
  [CreatingForType.CHAT]: Platform.Constants.ProjectType.CHAT,
  [CreatingForType.VOICE]: Platform.Constants.ProjectType.VOICE,
  [CreatingForType.BOTH]: Platform.Constants.ProjectType.CHAT,
};

export interface StepMetaPropsType {
  title: (val?: string) => string;
  canBack: boolean;
  canSkip: boolean;
  skipTo: (state: Partial<OnboardingContextState>) => StepID | null;
  trackStep: (props: OnboardingContextState, options: { skip: boolean }) => SyncThunk;
  docsLink?: React.ReactNode;
}

export type StepMetaProps = Record<StepID, StepMetaPropsType>;

export const STEP_META: StepMetaProps = {
  [StepID.WELCOME]: {
    title: () => 'Welcome',
    canBack: false,
    canSkip: false,
    skipTo: () => null,
    trackStep: () => () => null,
  },
  [StepID.CREATE_WORKSPACE]: {
    title: () => 'Create Workspace',
    canBack: true,
    canSkip: false,
    skipTo: () => null,
    trackStep: () => Tracking.trackOnboardingCreate(),
  },
  [StepID.PERSONALIZE_WORKSPACE]: {
    title: () => 'Create Profile',
    canBack: true,
    canSkip: false,
    skipTo: () => null,
    trackStep: () => Tracking.trackOnboardingPersonalize(),
  },
  [StepID.ADD_COLLABORATORS]: {
    title: (workspaceName) => (!workspaceName ? 'Invite teammates' : `Invite teammates to ${workspaceName}`),
    canBack: true,
    canSkip: true,
    skipTo: () => StepID.PAYMENT,
    trackStep: ({ addCollaboratorMeta }, { skip }) =>
      Tracking.trackOnboardingCollaborators({ skip, bookDemo: false, collaboratorCount: addCollaboratorMeta.collaborators.length }),
  },
  [StepID.PAYMENT]: {
    title: (plan) => `Sign up for ${plan}`,
    canBack: true,
    canSkip: false,
    skipTo: () => null,
    trackStep: ({ paymentMeta }, { skip }) => Tracking.trackOnboardingPay({ skip, plan: paymentMeta.plan! }),
  },
  [StepID.JOIN_WORKSPACE]: {
    title: () => 'Join Workspace',
    canBack: true,
    canSkip: true,
    skipTo: () => null,
    trackStep: ({ joinWorkspaceMeta }, { skip }) => Tracking.trackOnboardingJoin({ skip, role: joinWorkspaceMeta.role }),
  },
  [StepID.SELECT_CHANNEL]: {
    title: () => 'Assistant Type',
    canBack: true,
    canSkip: false,
    skipTo: () => null,
    trackStep: ({ selectChannelMeta }, { skip }) => Tracking.trackOnboardingSelectChannel({ skip, platform: selectChannelMeta.platform }),
  },
};

export const SELECTABLE_WORKSPACE_SPECIFIC_FLOW_TYPES = [
  SpecificFlowType.login_student_existing,
  SpecificFlowType.login_creator_existing,
  SpecificFlowType.existing_user_general_upgrade,
];
