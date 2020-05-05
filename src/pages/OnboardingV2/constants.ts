/* eslint-disable lodash/prefer-constant */

import * as Tracking from '@/ducks/tracking';

import StepID from './StepIDs';

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
    trackStep: () => Tracking.trackOnboardingV2Create(),
  },
  [StepID.PERSONALIZE_WORKSPACE]: {
    title: () => 'Personalize Workspace',
    canBack: true,
    canSkip: false,
    skipTo: null,
    trackStep: () => Tracking.trackOnboardingV2Personalize(),
  },
  [StepID.ADD_COLLABORATORS]: {
    title: () => 'Add Collaborators',
    canBack: true,
    canSkip: false,
    skipTo: StepID.PAYMENT,
    trackStep: ({ addCollaboratorMeta }, { skip }) =>
      Tracking.trackOnboardingV2Collaborators({
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
      Tracking.trackOnboardingV2Pay({
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
      Tracking.trackOnboardingV2Join({
        skip,
        role: joinWorkspaceMeta.role,
      }),
  },
};
