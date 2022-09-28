import { Nullable } from '@voiceflow/common';
import { UserRole } from '@voiceflow/internal/build/constants';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import client from '@/client';
import * as Session from '@/ducks/session';
import { SyncThunk } from '@/store/types';

import { EventName, SourceType } from '../constants';

export const trackSessionBegin =
  (workspaceIDs: string[] = [], email: Nullable<string>, roles: UserRole[]) =>
  () => {
    client.api.analytics.track(EventName.SESSION_BEGIN);
    client.api.analytics.identify({
      traits: { workspace_id: workspaceIDs, team_role: roles, email },
      teamhashed: ['workspace_id'],
    });
  };

export const trackSessionDuration = (duration: number) => () =>
  client.api.analytics.track(EventName.SESSION_DURATION, { properties: { duration: Math.floor(duration / 1000) } });

export const trackDeveloperAccountConnected =
  (platform: VoiceflowConstants.PlatformType, source: SourceType): SyncThunk =>
  (_dispatch, getState) => {
    const state = getState();
    const projectID = Session.activeProjectIDSelector(state);
    const workspaceID = Session.activeWorkspaceIDSelector(state);

    return client.api.analytics.track(EventName.DEVELOPER_ACCOUNT_CONNECTED, {
      properties: { platform, project_id: projectID, workspace_id: workspaceID, source },
    });
  };
