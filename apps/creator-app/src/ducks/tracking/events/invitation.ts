import client from '@/client';

import { EventName } from '../constants';
import type { BaseEventInfo, WorkspaceEventInfo } from '../types';
import { createBaseEventTrackerFactory, createWorkspaceEvent, createWorkspaceEventTracker } from '../utils';

type BaseInvitationEventInfo = Omit<WorkspaceEventInfo, keyof BaseEventInfo>;

const createInvitationEventTracker = createBaseEventTrackerFactory<BaseInvitationEventInfo>();

export const trackInvitationAccepted = createInvitationEventTracker<{ email: string; source: string; role?: string }>(
  ({ email, ...eventInfo }) =>
    client.analytics.track(createWorkspaceEvent(EventName.INVITATION_ACCEPT, { ...eventInfo, invitation_email: email }))
);

export const trackInvitationLinkCopy = createWorkspaceEventTracker<{ projectID: string | null }>(
  ({ projectID, ...eventInfo }) =>
    client.analytics.track(
      createWorkspaceEvent(EventName.INVITATION_COPY_LINK, { ...eventInfo, project_id: projectID })
    )
);
