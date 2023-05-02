import * as Platform from '@voiceflow/platform-config';

import client from '@/client';
import { browserIDSelector } from '@/ducks/session/selectors';

import { EventName } from '../constants';
import { createBaseEvent, createBaseEventTracker, createWorkspaceEvent } from '../utils';

export const trackOnboardingCreate = createBaseEventTracker((eventInfo) =>
  client.analytics.track(createBaseEvent(EventName.ONBOARDING_CREATE, eventInfo))
);

export const trackOnboardingPersonalize = createBaseEventTracker((eventInfo) =>
  client.analytics.track(createBaseEvent(EventName.ONBOARDING_PERSONALIZE, eventInfo))
);

export const trackOnboardingCollaborators = createBaseEventTracker<{ skip: boolean; bookDemo: boolean; collaboratorCount: number }>(
  ({ bookDemo, collaboratorCount, ...eventInfo }) =>
    client.analytics.track(
      createBaseEvent(EventName.ONBOARDING_COLLABORATORS, { ...eventInfo, book_demo: bookDemo, collaborator_count: collaboratorCount })
    )
);

export const trackOnboardingPay = createBaseEventTracker<{ skip: boolean; plan: string }>((eventInfo) =>
  client.analytics.track(createBaseEvent(EventName.ONBOARDING_PAY, eventInfo))
);

export const trackOnboardingJoin = createBaseEventTracker<{ skip: boolean; role: string }>((eventInfo) =>
  client.analytics.track(createBaseEvent(EventName.ONBOARDING_JOIN, eventInfo))
);

export const trackOnboardingSelectChannel = createBaseEventTracker<{ skip: boolean; platform: Platform.Constants.PlatformType }>((eventInfo) =>
  client.analytics.track(createBaseEvent(EventName.ONBOARDING_SELECT_CHANNEL, eventInfo))
);

export const trackOnboardingComplete = createBaseEventTracker<{
  skip: boolean;
  workspaceID: string;
  organizationID: string | null;
  cohort: 'A' | 'B';
}>((eventInfo) => client.analytics.track(createWorkspaceEvent(EventName.ONBOARDING_COMPLETE, eventInfo)));

export const trackOnboardingIdentify = createBaseEventTracker<{
  role: string;
  email: string | null;
  source: string | null;
  medium: string | null;
  content: string | null;
  company: string;
  campaign: string | null;
  modality: string;
  teamGoal: string;
  teamSize: string;
  creatorID: number | null;
}>(({ email, source, medium, content, campaign, teamGoal, teamSize, creatorID, ...eventInfo }, _, getState) =>
  client.analytics.identify({
    identity: creatorID ? { userID: creatorID } : { anonymousID: browserIDSelector(getState()) },
    properties: {
      ...eventInfo,
      ...(email && { email }),
      ...(source && { source }),
      ...(medium && { medium }),
      ...(content && { content }),
      ...(campaign && { campaign }),
      team_size: teamSize,
      team_goal: teamGoal,
    },
  })
);
