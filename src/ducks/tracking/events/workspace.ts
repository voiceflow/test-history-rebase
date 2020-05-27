/* eslint-disable import/prefer-default-export */
import client from '@/client';
import { EventName } from '@/ducks/tracking/constants';
import { Workspace } from '@/models';

export const trackWorkspace = (workspace: Workspace) => () => {
  client.analytics.track(EventName.WORKSPACE_SESSION_BEGIN, {
    teamhashed: ['workspace_id'],
    properties: {
      workspace_id: workspace.id,
    },
  });
  client.analytics.identifyWorkspace(workspace);
};
