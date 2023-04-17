import { UserRole } from '@voiceflow/internal';
import * as Platform from '@voiceflow/platform-config';

import client from '@/client';
import * as Session from '@/ducks/session';

import { EventName, SourceType } from '../constants';
import { createWorkspaceEvent, createWorkspaceEventTracker, getCurrentDate } from '../utils';

export const identifySignup = ({
  email,
  lastName,
  firstName,
  creatorID,
}: {
  email: string;
  lastName: string;
  firstName: string;
  creatorID: number;
}) => {
  client.analytics.identify({
    identity: { userID: creatorID },
    properties: {
      email,
      last_name: lastName,
      first_name: firstName,
      product_sign_up_date: getCurrentDate(),
    },
  });
};

export const trackSessionBegin =
  ({ email, roles, creatorID, workspaceIDs = [] }: { email: string; creatorID: number; roles: UserRole[]; workspaceIDs: string[] }) =>
  () => {
    const ctx = {
      envIDs: ['workspace_ids'],
      identity: { userID: creatorID },
      properties: { workspace_ids: workspaceIDs, team_role: roles, email, last_product_activity: getCurrentDate() },
      workspaceHashedIDs: ['workspace_ids'],
    };

    client.analytics.identify(ctx);

    client.analytics.track({ ...ctx, name: EventName.SESSION_BEGIN });
  };

export const trackSessionDuration =
  ({ duration, creatorID }: { duration: number; creatorID: number }) =>
  () =>
    client.analytics.track({ name: EventName.SESSION_DURATION, identity: { userID: creatorID }, properties: { duration } });

export const trackDeveloperAccountConnected = createWorkspaceEventTracker<{ platform: Platform.Constants.PlatformType; source: SourceType }>(
  (eventInfo, _, getState) => {
    const state = getState();
    const projectID = Session.activeProjectIDSelector(state);

    return client.analytics.track(createWorkspaceEvent(EventName.DEVELOPER_ACCOUNT_CONNECTED, { ...eventInfo, project_id: projectID }));
  }
);
