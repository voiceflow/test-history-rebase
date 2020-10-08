/* eslint-disable import/prefer-default-export */
import client from '@/client';
import { EventName } from '@/ducks/tracking/constants';
import { Workspace } from '@/models';
import { getHostName } from '@/utils/window';

export const trackWorkspace = (workspace: Workspace) => () => {
  client.analytics.track(EventName.WORKSPACE_SESSION_BEGIN, {
    teamhashed: ['workspace_id'],
    properties: {
      workspace_id: workspace.id,
      creator_version: getHostName(),
    },
  });
  client.analytics.identifyWorkspace(workspace);
};
