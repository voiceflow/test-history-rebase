import type React from 'react';

import type { OnboardingStepProps } from '@/pages/Onboarding/types';

import { StepID } from '../../constants';
import { CreateWorkspace, JoinWorkspace, Payment, PersonalizeWorkspace, SelectChannel, Welcome } from '../../Steps';

export const STEP_COMPONENTS: Record<StepID, React.FC<OnboardingStepProps>> = {
  [StepID.WELCOME]: Welcome,
  [StepID.CREATE_WORKSPACE]: CreateWorkspace,
  [StepID.PERSONALIZE_WORKSPACE]: PersonalizeWorkspace,
  [StepID.SELECT_CHANNEL]: SelectChannel,
  [StepID.PAYMENT]: Payment,
  [StepID.JOIN_WORKSPACE]: JoinWorkspace,
};
