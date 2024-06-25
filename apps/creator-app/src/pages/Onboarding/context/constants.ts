import { OnboardingType } from '../onboardingType.enum';
import { StepID } from '../stepID.enum';

export const UTM_COOKIE_NAME = 'Lead';

export interface UTMCookieType {
  parameters?: {
    utm_campaign?: string;
    utm_content?: string;
    utm_medium?: string;
    utm_source?: string;
    utm_term?: string;
  };
}
export const STEPS_BY_FLOW = {
  [OnboardingType.join]: [StepID.JOIN_WORKSPACE],
  [OnboardingType.create]: [StepID.WELCOME, StepID.PERSONALIZE_WORKSPACE, StepID.CREATE_WORKSPACE],
} as const;
