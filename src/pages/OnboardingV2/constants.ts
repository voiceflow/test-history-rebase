/* eslint-disable lodash/prefer-constant */
/* eslint-disable import/prefer-default-export */

import StepID from './StepIDs';
import { AddCollaborators, CreateWorkspace, JoinWorkspace, Payment, PersonalizeWorkspace } from './Steps';
import { OnboardingProps } from './types';

export type StepMetaPropsType = {
  title: (val?: string) => string;
  canBack: boolean;
  canSkip: boolean;
  skipTo: StepID | null;
  component: React.FC<OnboardingProps> | React.ForwardRefExoticComponent<React.RefAttributes<OnboardingProps>> | null;
};

export type StepMetaProps = Record<StepID, StepMetaPropsType>;

export const STEP_META: StepMetaProps = {
  [StepID.CREATE_WORKSPACE]: {
    title: () => 'Create Workspace',
    canBack: true,
    canSkip: false,
    skipTo: null,
    component: CreateWorkspace,
  },
  [StepID.PERSONALIZE_WORKSPACE]: {
    title: () => 'Personalize Workspace',
    canBack: true,
    canSkip: false,
    skipTo: null,
    component: PersonalizeWorkspace,
  },
  [StepID.ADD_COLLABORATORS]: {
    title: () => 'Add Collaborators',
    canBack: true,
    canSkip: false,
    skipTo: StepID.PAYMENT,
    component: AddCollaborators,
  },
  [StepID.PAYMENT]: {
    title: (plan) => `Sign up for ${plan}`,
    canBack: true,
    canSkip: false,
    skipTo: null,
    component: Payment,
  },
  [StepID.JOIN_WORKSPACE]: {
    title: () => 'Join Workspace',
    canBack: true,
    canSkip: true,
    skipTo: null,

    component: JoinWorkspace,
  },
};
