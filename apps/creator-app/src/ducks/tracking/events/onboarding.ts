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

export const trackOnboardingJoin = createBaseEventTracker<{ skip: boolean; role: string }>((eventInfo) =>
  client.analytics.track(createBaseEvent(EventName.ONBOARDING_JOIN, eventInfo))
);

export const trackOnboardingComplete = createBaseEventTracker<{
  skip: boolean;
  workspaceID: string;
  organizationID: string | null;
  cohort: 'A' | 'B';
}>((eventInfo) => client.analytics.track(createWorkspaceEvent(EventName.ONBOARDING_COMPLETE, eventInfo)));

export const trackOnboardingIdentify = createBaseEventTracker<{
  email: string | null;
  source: string | null;
  medium: string | null;
  content: string | null;
  useCase: string | null;
  campaign: string | null;
  workWithDevelopers: boolean | null;
  teamSize: string;
  creatorID: number | null;
  selfReportedAttribution: string;
}>(
  (
    {
      email,
      source,
      medium,
      content,
      campaign,
      workWithDevelopers,
      teamSize,
      creatorID,
      selfReportedAttribution,
      useCase,
      ...eventInfo
    },
    _,
    getState
  ) =>
    client.analytics.identify({
      identity: creatorID ? { userID: creatorID } : { anonymousID: browserIDSelector(getState()) },
      properties: {
        ...eventInfo,
        ...(email && { email }),
        ...(source && { source }),
        ...(medium && { medium }),
        ...(content && { content }),
        ...(campaign && { campaign }),
        use_case: useCase,
        team_size: teamSize,
        dev_resources: workWithDevelopers,
        self_reported_attribution_signup: selfReportedAttribution,
      },
    })
);
