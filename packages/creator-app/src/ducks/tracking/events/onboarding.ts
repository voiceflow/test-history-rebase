import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import client from '@/client';

import { EventName } from '../constants';

export const trackOnboardingCreate = () => () => client.api.analytics.track(EventName.ONBOARDING_CREATE);

export const trackOnboardingPersonalize = () => () => client.api.analytics.track(EventName.ONBOARDING_PERSONALIZE);

export const trackOnboardingCollaborators =
  ({ skip, bookDemo, collaboratorCount }: { skip: boolean; bookDemo: boolean; collaboratorCount: number }) =>
  () =>
    client.api.analytics.track(EventName.ONBOARDING_COLLABORATORS, {
      properties: {
        skip,
        'book demo': bookDemo,
        'collaborator count': collaboratorCount,
      },
    });

export const trackOnboardingPay = (properties: { skip: boolean; plan: string }) => () =>
  client.api.analytics.track(EventName.ONBOARDING_PAY, { properties });

export const trackOnboardingJoin = (properties: { skip: boolean; role: string }) => () =>
  client.api.analytics.track(EventName.ONBOARDING_JOIN, { properties });

export const trackOnboardingSelectChannel = (properties: { skip: boolean; platform: VoiceflowConstants.PlatformType }) => () =>
  client.api.analytics.track(EventName.ONBOARDING_SELECT_CHANNEL, { properties });

export const trackOnboardingComplete =
  ({ skip, workspaceID }: { skip: boolean; workspaceID: string }) =>
  () =>
    client.api.analytics.track(EventName.ONBOARDING_COMPLETE, {
      teamhashed: ['workspace_id'],
      properties: {
        skip,
        workspace_id: workspaceID,
      },
    });

export const trackOnboardingIdentify =
  ({
    role,
    email,
    source,
    medium,
    campaign,
    content,
    company,
  }: {
    company: string;
    role: string;
    email: string;
    source: string | null;
    medium: string | null;
    campaign: string | null;
    content: string | null;
  }) =>
  () => {
    client.api.analytics.identify({
      traits: {
        role,
        email,
        source,
        medium,
        campaign,
        content,
        company,
      },
    });
  };
