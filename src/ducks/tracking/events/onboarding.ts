import client from '@/client';

import { OnboardingExperience, OnboardingStage, OnboardingTeam, OnboardingUsage } from '../constants';

type Choices = {
  [OnboardingStage.TEAM]: OnboardingTeam;
  [OnboardingStage.USAGE]: OnboardingUsage;
  [OnboardingStage.EXPERIENCE]: OnboardingExperience;
};

export const trackOnboardingStage = (stage: OnboardingStage, choices: Choices) => () =>
  client.analytics.identify({ onboarding_stage: stage, ...choices });

export const trackOnboardingBegin = (choices: Choices) => trackOnboardingStage(OnboardingStage.WELCOME, choices);

export const trackOnboardingComplete = (choices: Choices) => trackOnboardingStage(OnboardingStage.COMPLETE, choices);
