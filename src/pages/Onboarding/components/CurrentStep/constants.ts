/* eslint-disable lodash/prefer-constant */
import React from 'react';

import { OnboardingProps } from '@/pages/Onboarding/types';

import { AddCollaborators, CreateWorkspace, JoinWorkspace, Payment, PersonalizeWorkspace, Welcome } from '../../Steps';
import { StepID } from '../../constants';

export type StepComponentProps = Record<StepID, React.FC<OnboardingProps>>;

export const STEP_COMPONENTS: StepComponentProps = {
  [StepID.WELCOME]: Welcome,
  [StepID.CREATE_WORKSPACE]: CreateWorkspace,
  [StepID.PERSONALIZE_WORKSPACE]: PersonalizeWorkspace,
  [StepID.ADD_COLLABORATORS]: AddCollaborators,
  [StepID.PAYMENT]: Payment,
  [StepID.JOIN_WORKSPACE]: JoinWorkspace,
};
