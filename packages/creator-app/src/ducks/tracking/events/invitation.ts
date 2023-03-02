import client from '@/client';

import { EventName } from '../constants';
import { createWorkspaceEventPayload, createWorkspaceEventTracker } from '../utils';

const createInvitationTracker = (eventName: EventName) => (workspaceID: string, email?: string, source?: string, userRole?: string) => () =>
  client.api.analytics.track(eventName, {
    teamhashed: ['workspace_id'],
    properties: {
      source,
      invitation_email: email,
      workspace_id: workspaceID,
      role: userRole,
    },
  });

export const trackInvitationSent = createInvitationTracker(EventName.INVITATION_SEND_EMAIL);

export const trackInvitationAccepted = createInvitationTracker(EventName.INVITATION_ACCEPT);

export const trackInvitationCancelled = createInvitationTracker(EventName.INVITATION_CANCEL);

export const trackInvitationLinkCopy = createWorkspaceEventTracker<{ projectID: string | null }>((options) =>
  client.api.analytics.track(EventName.INVITATION_COPY_LINK, createWorkspaceEventPayload(options, { project_id: options.projectID }))
);
