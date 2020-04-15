import React from 'react';

import AddCollaborators from './Steps/AddCollaborators';
import CreateWorkspace from './Steps/CreateWorkspace';
import Payment from './Steps/Payment';
import PersonalizeWorkspace from './Steps/PersonalizeWorkspace';

export enum STEP_IDS {
  CREATE_WORKSPACE = 'create_workspace',
  PERSONALIZE_WORKSPACE = 'personalize_workspace',
  ADD_COLLABORATORS = 'add_collaborators',
  PAYMENT = 'payment',
  JOIN_WORKSPACE = 'join_workspace',
}

export const STEP_META: Record<
  STEP_IDS,
  {
    title: (val?: string) => string;
    canBack: boolean;
    canSkip: boolean;
    skipTo: STEP_IDS | null;
    component: React.FC<any> | React.ForwardRefExoticComponent<React.RefAttributes<any>> | null;
  }
> = {
  [STEP_IDS.CREATE_WORKSPACE]: {
    // eslint-disable-next-line lodash/prefer-constant
    title: () => 'Create Workspace',
    canBack: true,
    canSkip: true,
    skipTo: STEP_IDS.PERSONALIZE_WORKSPACE,

    component: CreateWorkspace,
  },
  [STEP_IDS.PERSONALIZE_WORKSPACE]: {
    // eslint-disable-next-line lodash/prefer-constant
    title: () => 'Personalize Workspace',
    canBack: true,
    canSkip: true,
    skipTo: STEP_IDS.PAYMENT,
    component: PersonalizeWorkspace,
  },
  [STEP_IDS.ADD_COLLABORATORS]: {
    // eslint-disable-next-line lodash/prefer-constant
    title: () => 'Add Collaborators',
    canBack: true,
    canSkip: true,
    skipTo: null,
    component: AddCollaborators,
  },
  [STEP_IDS.PAYMENT]: {
    title: (plan) => `Sign up for ${plan}`,
    canBack: true,
    canSkip: false,
    skipTo: null,
    component: Payment,
  },
  [STEP_IDS.JOIN_WORKSPACE]: {
    // eslint-disable-next-line lodash/prefer-constant
    title: () => 'Join Workspace',
    canBack: true,
    canSkip: true,
    skipTo: null,

    component: null,
  },
};
