import React from 'react';

import AddCollaborators from './Steps/AddCollaborators';
import CreateWorkspace from './Steps/CreateWorkspace';
import { OnboardingContextProps } from './context';

export enum STEP_IDS {
  CREATE_WORKSPACE = 'create_workspace',
  PERSONALIZE_WORKSPACE = 'personalize_workspace',
  ADD_COLLABORATORS = 'add_collaborators',
  START_FREE_TRIAL = 'start_free_trial',
  JOIN_WORKSPACE = 'join_workspace',
}

export const STEP_META: Record<
  STEP_IDS,
  {
    title: string;
    canBack: boolean;
    canSkip: boolean;
    skipTo: STEP_IDS | null;
    component: React.ForwardRefExoticComponent<React.RefAttributes<OnboardingContextProps>> | null;
  }
> = {
  [STEP_IDS.CREATE_WORKSPACE]: {
    title: 'Create Workspace',
    canBack: true,
    canSkip: true,
    skipTo: STEP_IDS.ADD_COLLABORATORS,
    component: CreateWorkspace,
  },
  [STEP_IDS.PERSONALIZE_WORKSPACE]: {
    title: 'Personalize Workspace',
    canBack: true,
    canSkip: false,
    skipTo: null,
    component: null,
  },
  [STEP_IDS.ADD_COLLABORATORS]: {
    title: 'Add Collaborators',
    canBack: true,
    canSkip: true,
    skipTo: null,
    component: AddCollaborators,
  },
  [STEP_IDS.START_FREE_TRIAL]: {
    title: 'Start Free Trial',
    canBack: true,
    canSkip: false,
    skipTo: null,
    component: null,
  },
  [STEP_IDS.JOIN_WORKSPACE]: {
    title: 'Join Workspace',
    canBack: true,
    canSkip: true,
    skipTo: null,

    component: null,
  },
};
