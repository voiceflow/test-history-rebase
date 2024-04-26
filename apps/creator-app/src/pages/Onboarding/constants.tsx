import type React from 'react';

import * as Tracking from '@/ducks/tracking';
import type { OnboardingContextState } from '@/pages/Onboarding/context/types';
import { SpecificFlowType } from '@/pages/Onboarding/context/types';
import type { SyncThunk } from '@/store/types';

import { TeamSizeType } from './types';

export const StepID = {
  WELCOME: 'welcome',
  CREATE_WORKSPACE: 'create_workspace',
  PERSONALIZE_WORKSPACE: 'personalize_workspace',
  PAYMENT: 'payment',
  JOIN_WORKSPACE: 'join_workspace',
  SELECT_CHANNEL: 'select_channel',
} as const;

export type StepID = (typeof StepID)[keyof typeof StepID];

export const WORK_WITH_DEVELOPERS_OPTIONS = [
  { id: true, label: 'Yes' },
  { id: false, label: 'No' },
];

export const TEAM_SIZE_OPTIONS = [
  { id: TeamSizeType.INDIVIDUAL, label: 'Just me' },
  { id: TeamSizeType.SMALL, label: 'Small team (2-5)' },
  { id: TeamSizeType.LARGE, label: 'Large team (5+)' },
];

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
    trackStep: ({ joinWorkspaceMeta }, { skip }) =>
      Tracking.trackOnboardingJoin({ skip, role: joinWorkspaceMeta.role }),
  },
  [StepID.SELECT_CHANNEL]: {
    title: () => 'Assistant Type',
    canBack: true,
    canSkip: false,
    skipTo: () => null,
    trackStep: ({ selectChannelMeta }, { skip }) =>
      Tracking.trackOnboardingSelectChannel({ skip, platform: selectChannelMeta.platform }),
  },
};

export const SELECTABLE_WORKSPACE_SPECIFIC_FLOW_TYPES = [
  SpecificFlowType.login_student_existing,
  SpecificFlowType.login_creator_existing,
  SpecificFlowType.existing_user_general_upgrade,
];
