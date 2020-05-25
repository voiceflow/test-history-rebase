import client from '@/client';

import { EventName } from '../constants';

export const trackOnboardingCreate = () => () => client.analytics.track(EventName.ONBOARDING_CREATE);

export const trackOnboardingPersonalize = () => () => client.analytics.track(EventName.ONBOARDING_PERSONALIZE);

export const trackOnboardingCollaborators = ({
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

export const trackOnboardingPay = (properties: { skip: boolean; plan: string }) => () =>
  client.analytics.track(EventName.ONBOARDING_PAY, { properties });

export const trackOnboardingJoin = (properties: { skip: boolean; role: string }) => () =>
  client.analytics.track(EventName.ONBOARDING_JOIN, { properties });

export const trackOnboardingComplete = ({ skip, workspaceID }: { skip: boolean; workspaceID: string }) => () =>
  client.analytics.track(EventName.ONBOARDING_COMPLETE, {
    teamhashed: ['workspace_id'],
    properties: {
      skip,
      workspace_id: workspaceID,
    },
  });

export const trackOnboardingIdentify = ({
  name,
  role,
  email,
  channels,
  teamSize,
  workspaceIDs,
}: {
  name: string;
  role: string;
  email: string;
  channels: string[];
  teamSize: string;
  workspaceIDs: string[];
}) => () => {
  return client.analytics.identify({
    name,
    role,
    email,
    channels,
    teamsize: teamSize,
    workspace_ids: workspaceIDs,
  });
};
