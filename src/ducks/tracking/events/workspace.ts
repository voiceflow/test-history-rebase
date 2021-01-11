/* eslint-disable import/prefer-default-export */
import client from '@/client';
import { EventName } from '@/ducks/tracking/constants';
import { Workspace } from '@/models';
import { getHostName } from '@/utils/window';

import { createWorkspaceEventPayload } from '../utils';

export const trackWorkspace = (workspace: Workspace) => () => {
  client.analytics.track(
    EventName.WORKSPACE_SESSION_BEGIN,
    createWorkspaceEventPayload({ workspaceID: workspace.id }, { creator_version: getHostName() })
  );

  client.analytics.identifyWorkspace(workspace);
};

export const trackWorkspaceDelete = (workspaceID: string) => () => {
  client.analytics.track(EventName.WORKSPACE_DELETE, createWorkspaceEventPayload({ workspaceID }));
};
