import { Constants } from '@voiceflow/general-types';

import client from '@/client';
import * as Session from '@/ducks/session';
import { SyncThunk } from '@/store/types';

import { EventName, SourceType } from '../constants';

export const trackSessionBegin =
  (workspaceIDs: string[] = []) =>
  () => {
    client.api.analytics.track(EventName.SESSION_BEGIN);
    client.api.analytics.identify({
      traits: { workspace_id: workspaceIDs },
      teamhashed: ['workspace_id'],
    });
  };

export const trackSessionDuration = (duration: number) => () =>
  client.api.analytics.track(EventName.SESSION_DURATION, { properties: { duration: Math.floor(duration / 1000) } });

export const trackDeveloperAccountConnected =
  (platform: Constants.PlatformType, source: SourceType): SyncThunk =>
  (_dispatch, getState) => {
    const state = getState();
    const projectID = Session.activeProjectIDSelector(state);
    const workspaceID = Session.activeWorkspaceIDSelector(state);

    return client.api.analytics.track(EventName.DEVELOPER_ACCOUNT_CONNECTED, {
      properties: { platform, project_id: projectID, workspace_id: workspaceID, source },
    });
  };
