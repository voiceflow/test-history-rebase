import client from '@/client';

import { EventName, OnboardingExperience, OnboardingStage, OnboardingTeam, OnboardingUsage } from '../constants';

type Choices = {
  [OnboardingStage.TEAM]: OnboardingTeam;
  [OnboardingStage.USAGE]: OnboardingUsage;
  [OnboardingStage.EXPERIENCE]: OnboardingExperience;
};

export const trackOnboardingStage = (stage: OnboardingStage, choices: Choices) => () =>
  client.analytics.identify({ onboarding_stage: stage, ...choices });

export const trackOnboardingBegin = (choices: Choices) => trackOnboardingStage(OnboardingStage.WELCOME, choices);

export const trackOnboardingComplete = (choices: Choices) => trackOnboardingStage(OnboardingStage.COMPLETE, choices);

// OnboardingV2

export const trackOnboardingV2Create = () => () => client.analytics.track(EventName.ONBOARDING_CREATE);

export const trackOnboardingV2Personalize = () => () => client.analytics.track(EventName.ONBOARDING_PERSONALIZE);

export const trackOnboardingV2Collaborators = ({
  skip,
  bookDemo,
  collaboratorCount,
}: {
  skip: boolean;
  bookDemo: boolean;
  collaboratorCount: number;
}) => () =>
  client.analytics.track(EventName.ONBOARDING_COLLABORATORS, {
    properties: {
      skip,
      'book demo': bookDemo,
      'collaborator count': collaboratorCount,
    },
  });

export const trackOnboardingV2Pay = (properties: { skip: boolean; plan: string }) => () =>
  client.analytics.track(EventName.ONBOARDING_PAY, { properties });

export const trackOnboardingV2Join = (properties: { skip: boolean; role: string }) => () =>
  client.analytics.track(EventName.ONBOARDING_JOIN, { properties });

export const trackOnboardingV2Complete = ({ skip, workspaceID }: { skip: boolean; workspaceID: string }) => () =>
  client.analytics.track(EventName.ONBOARDING_COMPLETE, {
    teamhashed: ['workspace_id'],
    properties: {
      skip,
      workspace_id: workspaceID,
    },
  });

export const trackOnboardingV2Identify = ({
  name,
  role,
  email,
  channels,
  teamSize,
}: {
  name: string;
  role: string;
  email: string;
  channels: string[];
  teamSize: string;
}) => () => {
  return client.analytics.identify({
    name,
    role,
    email,
    channels,
    teamsize: teamSize,
  });
};
