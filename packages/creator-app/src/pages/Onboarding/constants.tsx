import { Constants } from '@voiceflow/general-types';
import React from 'react';

import * as Tracking from '@/ducks/tracking';
import { OnboardingContextState, SpecificFlowType } from '@/pages/Onboarding/context/types';

export enum StepID {
  WELCOME = 'welcome',
  CREATE_WORKSPACE = 'create_workspace',
  PERSONALIZE_WORKSPACE = 'personalize_workspace',
  ADD_COLLABORATORS = 'add_collaborators',
  PAYMENT = 'payment',
  JOIN_WORKSPACE = 'join_workspace',
  SELECT_CHANNEL = 'select_channel',
}

export interface StepMetaPropsType {
  title: (val?: string) => string;
  canBack: boolean;
  canSkip: boolean;
  skipTo: (state: Partial<OnboardingContextState>) => StepID | null;
  trackStep: (props: any, options: { skip: boolean }) => void;
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
    skipTo: ({ justCreatingWorkspace, upgradingAWorkspace }) =>
      justCreatingWorkspace || upgradingAWorkspace ? StepID.PAYMENT : StepID.SELECT_CHANNEL,
    trackStep: ({ addCollaboratorMeta }, { skip }) =>
      Tracking.trackOnboardingCollaborators({
        skip,
        bookDemo: addCollaboratorMeta.isDemoBooked,
        collaboratorCount: addCollaboratorMeta.collaborators.length,
      }),
  },
  [StepID.PAYMENT]: {
    title: (plan) => `Sign up for ${plan}`,
    canBack: true,
    canSkip: false,
    skipTo: () => null,
    trackStep: ({ paymentMeta }, { skip }) =>
      Tracking.trackOnboardingPay({
        skip,
        plan: paymentMeta.plan,
      }),
  },
  [StepID.JOIN_WORKSPACE]: {
    title: () => 'Join Workspace',
    canBack: true,
    canSkip: true,
    skipTo: () => null,
    trackStep: ({ joinWorkspaceMeta }, { skip }) =>
      Tracking.trackOnboardingJoin({
        skip,
        role: joinWorkspaceMeta.role,
      }),
  },
  [StepID.SELECT_CHANNEL]: {
    title: () => 'Project Type',
    canBack: true,
    canSkip: false,
    skipTo: () => null,
    trackStep: ({ selectChannelMeta }, { skip }) =>
      Tracking.trackOnboardingSelectChannel({
        skip,
        platform: selectChannelMeta.channel as Constants.PlatformType,
      }),
  },
};

export const SELECTABLE_WORKSPACE_SPECIFIC_FLOW_TYPES = [
  SpecificFlowType.login_student_existing,
  SpecificFlowType.login_creator_existing,
  SpecificFlowType.existing_user_general_upgrade,
];
