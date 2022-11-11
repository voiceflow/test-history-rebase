import { Nullable } from '@voiceflow/common';
import { UserRole } from '@voiceflow/internal';
import * as Platform from '@voiceflow/platform-config';

import client from '@/client';
import * as Session from '@/ducks/session';
import { SyncThunk } from '@/store/types';

import { EventName, SourceType } from '../constants';

export const identifySignup = (creatorID: number, firstName: string, lastName: string, email: string) => {
  client.api.analytics.identify({
    traits: { first_name: firstName, last_name: lastName, user_id: creatorID, email, product_sign_up_date: new Date().toISOString().slice(0, 10) },
  });
};

export const trackSessionBegin =
  (workspaceIDs: string[] = [], email: Nullable<string>, roles: UserRole[]) =>
  () => {
    client.api.analytics.track(EventName.SESSION_BEGIN);
    client.api.analytics.identify({
      traits: { workspace_id: workspaceIDs, team_role: roles, email, last_product_activity: new Date().toISOString().slice(0, 10) },
      teamhashed: ['workspace_id'],
    });
  };

export const trackSessionDuration = (duration: number) => () =>
  client.api.analytics.track(EventName.SESSION_DURATION, { properties: { duration: Math.floor(duration / 1000) } });

export const trackDeveloperAccountConnected =
  (platform: Platform.Constants.PlatformType, source: SourceType): SyncThunk =>
  (_dispatch, getState) => {
    const state = getState();
    const projectID = Session.activeProjectIDSelector(state);
    const workspaceID = Session.activeWorkspaceIDSelector(state);

    return client.api.analytics.track(EventName.DEVELOPER_ACCOUNT_CONNECTED, {
      properties: { platform, project_id: projectID, workspace_id: workspaceID, source },
    });
  };
