import { ChannelType } from '@/constants';
import * as Tracking from '@/ducks/tracking';
import { SpecificFlowType } from '@/pages/Onboarding/context/types';

import { CHANNEL_META } from '../NewProject/Steps/constants';

export const ONBOARDING_PROJECT_NAME = 'First Project';

export enum StepID {
  WELCOME = 'welcome',
  CREATE_WORKSPACE = 'create_workspace',
  PERSONALIZE_WORKSPACE = 'personalize_workspace',
  ADD_COLLABORATORS = 'add_collaborators',
  PAYMENT = 'payment',
  JOIN_WORKSPACE = 'join_workspace',
  SELECT_CHANNEL = 'select_channel',
}

export type StepMetaPropsType = {
  title: (val?: string) => string;
  canBack: boolean;
  canSkip: boolean;
  skipTo: StepID | null;
  trackStep: (props: any, options: { skip: boolean }) => void;
};

export type StepMetaProps = Record<StepID, StepMetaPropsType>;

export const STEP_META: StepMetaProps = {
  [StepID.WELCOME]: {
    title: () => 'Welcome',
    canBack: false,
    canSkip: false,
    skipTo: null,
    trackStep: () => () => null,
  },
  [StepID.CREATE_WORKSPACE]: {
    title: () => 'Create Workspace',
    canBack: true,
    canSkip: false,
    skipTo: null,
    trackStep: () => Tracking.trackOnboardingCreate(),
  },
  [StepID.PERSONALIZE_WORKSPACE]: {
    title: () => 'Create Profile',
    canBack: true,
    canSkip: false,
    skipTo: null,
    trackStep: () => Tracking.trackOnboardingPersonalize(),
  },
  [StepID.ADD_COLLABORATORS]: {
    title: (workspaceName) => (!workspaceName ? 'Invite teammates' : `Invite teammates to ${workspaceName}`),
    canBack: true,
    canSkip: true,
    skipTo: StepID.PAYMENT,
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
    skipTo: null,
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
    skipTo: null,
    trackStep: ({ joinWorkspaceMeta }, { skip }) =>
      Tracking.trackOnboardingJoin({
        skip,
        role: joinWorkspaceMeta.role,
      }),
  },
  [StepID.SELECT_CHANNEL]: {
    title: () => 'Select Channel',
    canBack: true,
    canSkip: false,
    skipTo: null,
    trackStep: ({ selectChannelMeta }, { skip }) =>
      Tracking.trackOnboardingSelectChannel({
        skip,
        platform: CHANNEL_META[selectChannelMeta.channel as ChannelType].platform,
      }),
  },
};

export const SELECTABLE_WORKSPACE_SPECIFIC_FLOW_TYPES = [SpecificFlowType.login_student_existing, SpecificFlowType.login_creator_existing];
