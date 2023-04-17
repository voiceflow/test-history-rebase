import { datadogRum } from '@datadog/browser-rum';
import { PlanType } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';

import client from '@/client';
import { DATADOG_SITE } from '@/config';
import { EventName } from '@/ducks/tracking/constants';
import { getHostName } from '@/utils/window';

import { createBaseEventTracker, createWorkspaceEvent, createWorkspaceEventTracker } from '../utils';

export const trackWorkspace = createBaseEventTracker<{ workspace: Realtime.Workspace }>(({ workspace, ...eventInfo }) => {
  const context = datadogRum.getInternalContext();

  const sessionURL = context ? `https://app.${DATADOG_SITE}/rum/replay/sessions/${context.session_id}` : undefined;

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

export const trackWorkspaceDelete = createBaseEventTracker<{ workspace: Realtime.Workspace }>(({ workspace, ...eventInfo }) => {
  client.analytics.track(
    createWorkspaceEvent(EventName.WORKSPACE_DELETE, {
      ...eventInfo,
      workspaceID: workspace.id,
      organizationID: workspace.organizationID,
    })
  );
});

export const trackDashboardStyleChanged = createWorkspaceEventTracker<{ style: 'kanban' | 'card' }>((eventInfo) =>
  client.analytics.track(createWorkspaceEvent(EventName.DASHBOARD_STYLE_CHANGED, eventInfo))
);

export const trackDashboardLinkClicked = createWorkspaceEventTracker<{ linkType: string }>(({ linkType, ...eventInfo }) =>
  client.analytics.track(createWorkspaceEvent(EventName.DASHBOARD_LINK_CLICKED, { ...eventInfo, link_type: linkType }))
);

export const trackPlanChanged = createWorkspaceEventTracker<{ newPlan: PlanType; currentPlan: PlanType }>(({ newPlan, currentPlan, ...eventInfo }) =>
  client.analytics.track(createWorkspaceEvent(EventName.PLAN_CHANGED, { ...eventInfo, new_plan: newPlan, current_plan: currentPlan }))
);

export const trackSeatChange = createWorkspaceEventTracker<{ reduced: boolean; scheduled: boolean }>(({ reduced, scheduled, ...eventInfo }) =>
  client.analytics.track(
    createWorkspaceEvent(EventName.SEATS_CHANGE, { ...eventInfo, type: scheduled ? 'scheduled' : 'immediate', seats: reduced ? 'reduced' : 'added' })
  )
);
