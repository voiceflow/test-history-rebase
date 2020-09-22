import client from '@/client';

import { EventName } from '../constants';

const createInvitationTracker = (eventName: EventName) => (workspaceID: string, email?: string, source?: string) => () =>
  client.analytics.track(eventName, {
    teamhashed: ['invitation_workspace_id'],
    properties: {
      source,
      invitation_email: email,
      invitation_workspace_id: workspaceID,
    },
  });

export const trackInvitationSent = createInvitationTracker(EventName.INVITATION_SEND_EMAIL);

export const trackInvitationAccepted = createInvitationTracker(EventName.INVITATION_ACCEPT);

export const trackInvitationCancelled = createInvitationTracker(EventName.INVITATION_CANCEL);
