/* eslint-disable lodash/prefer-constant */
import React from 'react';

import { OnboardingProps } from '@/pages/OnboardingV2/types';

import StepID from '../../StepIDs';
import { AddCollaborators, CreateWorkspace, JoinWorkspace, Payment, PersonalizeWorkspace } from '../../Steps';

export type StepComponentProps = Record<StepID, React.FC<OnboardingProps>>;

export const STEP_COMPONENTS: StepComponentProps = {
  [StepID.CREATE_WORKSPACE]: CreateWorkspace,
  [StepID.PERSONALIZE_WORKSPACE]: PersonalizeWorkspace,
  [StepID.ADD_COLLABORATORS]: AddCollaborators,
  [StepID.PAYMENT]: Payment,
  [StepID.JOIN_WORKSPACE]: JoinWorkspace,
};
