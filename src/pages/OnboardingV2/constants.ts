/* eslint-disable lodash/prefer-constant */
/* eslint-disable import/prefer-default-export */

import { AddCollaborators, CreateWorkspace, JoinWorkspace, Payment, PersonalizeWorkspace } from './Steps';
import { OnboardingProps } from './types';

export enum StepID {
  CREATE_WORKSPACE = 'create_workspace',
  PERSONALIZE_WORKSPACE = 'personalize_workspace',
  ADD_COLLABORATORS = 'add_collaborators',
  PAYMENT = 'payment',
  JOIN_WORKSPACE = 'join_workspace',
}

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
    canSkip: true,
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
