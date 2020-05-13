/* eslint-disable lodash/prefer-constant */

import * as Tracking from '@/ducks/tracking';

import StepID from './StepIDs';

export const ONBOARDING_PROJECT_NAME = 'First Project';

export type StepMetaPropsType = {
  title: (val?: string) => string;
  canBack: boolean;
  canSkip: boolean;
  skipTo: StepID | null;
  trackStep: (props: any, options: { skip: boolean }) => void;
};

export type StepMetaProps = Record<StepID, StepMetaPropsType>;

export const STEP_META: StepMetaProps = {
  [StepID.CREATE_WORKSPACE]: {
    title: () => 'Create Workspace',
    canBack: true,
    canSkip: false,
    skipTo: null,
    trackStep: () => Tracking.trackOnboardingCreate(),
  },
  [StepID.PERSONALIZE_WORKSPACE]: {
    title: () => 'Personalize Workspace',
    canBack: true,
    canSkip: false,
    skipTo: null,
    trackStep: () => Tracking.trackOnboardingPersonalize(),
  },
  [StepID.ADD_COLLABORATORS]: {
    title: () => 'Add Collaborators',
    canBack: true,
    canSkip: false,
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
};
