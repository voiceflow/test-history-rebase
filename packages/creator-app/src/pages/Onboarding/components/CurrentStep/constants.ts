import React from 'react';

import { OnboardingStepProps } from '@/pages/Onboarding/types';

import { StepID } from '../../constants';
import { AddCollaborators, CreateWorkspace, JoinWorkspace, Payment, PersonalizeWorkspace, SelectChannel, Welcome } from '../../Steps';

export const STEP_COMPONENTS: Record<StepID, React.FC<OnboardingStepProps>> = {
  [StepID.WELCOME]: Welcome,
  [StepID.CREATE_WORKSPACE]: CreateWorkspace,
  [StepID.PERSONALIZE_WORKSPACE]: PersonalizeWorkspace,
  [StepID.ADD_COLLABORATORS]: AddCollaborators,
  [StepID.SELECT_CHANNEL]: SelectChannel,
  [StepID.PAYMENT]: Payment,
  [StepID.JOIN_WORKSPACE]: JoinWorkspace,
};
