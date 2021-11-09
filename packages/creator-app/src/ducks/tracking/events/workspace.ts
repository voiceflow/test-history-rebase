import * as Realtime from '@voiceflow/realtime-sdk';

import client from '@/client';
import { EventName } from '@/ducks/tracking/constants';
import { getHostName } from '@/utils/window';

import { createWorkspaceEventPayload } from '../utils';

export const trackWorkspace = (workspace: Realtime.Workspace) => () => {
  client.api.analytics.track(
    EventName.WORKSPACE_SESSION_BEGIN,
    createWorkspaceEventPayload({ workspaceID: workspace.id }, { creator_version: getHostName() })
  );

  client.api.analytics.identifyWorkspace(workspace.id, { name: workspace.name });
};

export const trackWorkspaceDelete = (workspaceID: string) => () => {
  client.api.analytics.track(EventName.WORKSPACE_DELETE, createWorkspaceEventPayload({ workspaceID }));
};
