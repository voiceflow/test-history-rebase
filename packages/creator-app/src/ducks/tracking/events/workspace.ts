import { datadogRum } from '@datadog/browser-rum';

import client from '@/client';
import { DATADOG_SITE } from '@/config';
import { EventName } from '@/ducks/tracking/constants';
import { workspaceByIDSelector } from '@/ducks/workspaceV2';
import { getHostName } from '@/utils/window';

import { createBaseEventTracker, createWorkspaceEvent } from '../utils';

export const trackWorkspace = createBaseEventTracker<{ workspaceID: string }>(({ workspaceID, ...eventInfo }, _, getState) => {
  const workspace = workspaceByIDSelector(getState(), { id: workspaceID });

  const context = datadogRum.getInternalContext();

  const sessionURL = context ? `https://app.${DATADOG_SITE}/rum/replay/sessions/${context.session_id}` : undefined;

  if (!workspace) return;

  client.analytics.group({
    groupID: workspace.id,
    properties: { name: workspace.name },
  });

  client.analytics.track(
    createWorkspaceEvent(EventName.WORKSPACE_SESSION_BEGIN, {
      ...eventInfo,
      sessionURL,
      workspaceID: workspace.id,
      organizationID: workspace.organizationID,
      creator_version: getHostName(),
    })
  );
});

export const trackWorkspaceDelete = createBaseEventTracker<{ workspaceID: string }>(({ workspaceID, ...eventInfo }, _, getState) => {
  const workspace = workspaceByIDSelector(getState(), { id: workspaceID });

  if (!workspace) return;

  client.analytics.track(
    createWorkspaceEvent(EventName.WORKSPACE_DELETE, {
      ...eventInfo,
      workspaceID: workspace.id,
      organizationID: workspace.organizationID,
    })
  );
});
