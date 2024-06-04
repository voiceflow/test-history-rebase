import React from 'react';

import { StepID } from '../stepID.enum';
import {
  OnboardingStepsCreateWorkspace,
  OnboardingStepsJoinWorkspace,
  OnboardingStepsPersonalizeWorkspace,
  OnboardingStepsWelcome,
} from '../Steps';

export const STEP_COMPONENTS: Record<StepID, React.FC> = {
  [StepID.WELCOME]: OnboardingStepsWelcome,
  [StepID.CREATE_WORKSPACE]: OnboardingStepsCreateWorkspace,
  [StepID.PERSONALIZE_WORKSPACE]: OnboardingStepsPersonalizeWorkspace,
  [StepID.JOIN_WORKSPACE]: OnboardingStepsJoinWorkspace,
};
