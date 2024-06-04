import React from 'react';

import * as Tracking from '@/ducks/tracking';
import { OnboardingContextState } from '@/pages/Onboarding/context/types';
import { SyncThunk } from '@/store/types';

import { TeamSizeType } from './types';

export const StepID = {
  WELCOME: 'welcome',
  CREATE_WORKSPACE: 'create_workspace',
  PERSONALIZE_WORKSPACE: 'personalize_workspace',
  JOIN_WORKSPACE: 'join_workspace',
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
  trackStep: (props: OnboardingContextState, options: { skip: boolean }) => SyncThunk;
  docsLink?: React.ReactNode;
}

export type StepMetaProps = Record<StepID, StepMetaPropsType>;

export const STEP_META: StepMetaProps = {
  [StepID.WELCOME]: {
    title: () => 'Welcome',
    canBack: false,
    canSkip: false,
    trackStep: () => () => null,
  },
  [StepID.CREATE_WORKSPACE]: {
    title: () => 'Create Workspace',
    canBack: true,
    canSkip: false,
    trackStep: () => Tracking.trackOnboardingCreate(),
  },
  [StepID.PERSONALIZE_WORKSPACE]: {
    title: () => 'Create Profile',
    canBack: true,
    canSkip: false,
    trackStep: () => Tracking.trackOnboardingPersonalize(),
  },
  [StepID.JOIN_WORKSPACE]: {
    title: () => 'Join Workspace',
    canBack: true,
    canSkip: true,
    trackStep: ({ joinWorkspaceMeta }, { skip }) =>
      Tracking.trackOnboardingJoin({ skip, role: joinWorkspaceMeta.role }),
  },
};

export enum OnboardingType {
  create = 'create_workspace',
  join = 'join_workpsace',
}

export const STEPS_BY_FLOW = {
  [OnboardingType.join]: [StepID.JOIN_WORKSPACE],
  [OnboardingType.create]: [StepID.WELCOME, StepID.PERSONALIZE_WORKSPACE, StepID.CREATE_WORKSPACE],
} as const;
