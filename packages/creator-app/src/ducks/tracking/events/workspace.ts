import * as Realtime from '@voiceflow/realtime-sdk';
import LogRocket from 'logrocket';

import client from '@/client';
import { EventName } from '@/ducks/tracking/constants';
import { getHostName } from '@/utils/window';

import { createWorkspaceEventPayload } from '../utils';

export const trackWorkspace = (workspace: Realtime.Workspace) => () => {
  LogRocket.getSessionURL((sessionURL) => {
    client.api.analytics.track(
      EventName.WORKSPACE_SESSION_BEGIN,
      createWorkspaceEventPayload({ workspaceID: workspace.id, sessionURL }, { creator_version: getHostName() })
    );
  });

  client.api.analytics.identifyWorkspace(workspace.id, { name: workspace.name });
};

export const trackWorkspaceDelete = (workspaceID: string) => () => {
  client.api.analytics.track(EventName.WORKSPACE_DELETE, createWorkspaceEventPayload({ workspaceID }));
};
