import { OnboardingType } from '../onboardingType.enum';
import { StepID } from '../stepID.enum';

export const STEPS_BY_FLOW = {
  [OnboardingType.join]: [StepID.JOIN_WORKSPACE],
  [OnboardingType.create]: [StepID.WELCOME, StepID.PERSONALIZE_WORKSPACE, StepID.CREATE_WORKSPACE],
} as const;
