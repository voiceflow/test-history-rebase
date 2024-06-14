import { datadogRum } from '@datadog/browser-rum';
import { PlanName } from '@voiceflow/dtos';
import { PlanType } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';

import client from '@/client';
import { DATADOG_SITE } from '@/config';
import { getOrganizationByIDSelector } from '@/ducks/organization/organization.select';
import { EventName } from '@/ducks/tracking/constants';
import { organizationTrialEndAtSelector } from '@/ducks/workspaceV2/selectors/active';
import { isAdminUserRole, isEditorUserRole, isViewerUserRole } from '@/utils/role';
import { getHostName } from '@/utils/window';

import { createBaseEventTracker, createWorkspaceEvent, createWorkspaceEventTracker } from '../utils';

export const trackWorkspace = createBaseEventTracker<{ workspace: Realtime.Workspace }>(({ workspace, ...eventInfo }, _dispatch, getState) => {
  const context = datadogRum.getInternalContext();
  const getOrganizationByID = getOrganizationByIDSelector(getState());
  const trialEndDate = organizationTrialEndAtSelector(getState());

  const organization = workspace.organizationID ? getOrganizationByID({ id: workspace.organizationID }) : null;

  const sessionURL = context ? `https://app.${DATADOG_SITE}/rum/replay/sessions/${context.session_id}` : undefined;

  let admins = 0;
  let editors = 0;
  let viewers = 0;

  Object.values(workspace.members.byKey).forEach((member) => {
    if (isAdminUserRole(member.role)) admins += 1;
    if (isEditorUserRole(member.role)) editors += 1;
    if (isViewerUserRole(member.role)) viewers += 1;
  });

  client.analytics.group({
    groupID: workspace.id,
    properties: {
      org_id: workspace.organizationID,
      org_name: organization?.name ?? null,
      plan: workspace.plan,
      seats: workspace.seats,
      team_id: workspace.id,
      team_name: workspace.name,
      trial_end_date: trialEndDate,
      admins,
      editors,
      viewers,
    },
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

export const trackPlanChanged = createWorkspaceEventTracker<{ newPlan: PlanType | PlanName; currentPlan: PlanType | PlanName }>(
  ({ newPlan, currentPlan, ...eventInfo }) =>
    client.analytics.track(createWorkspaceEvent(EventName.PLAN_CHANGED, { ...eventInfo, new_plan: newPlan, current_plan: currentPlan }))
);

export const trackSeatChange = createWorkspaceEventTracker<{ reduced: boolean; scheduled: boolean }>(({ reduced, scheduled, ...eventInfo }) =>
  client.analytics.track(
    createWorkspaceEvent(EventName.SEATS_CHANGE, { ...eventInfo, type: scheduled ? 'scheduled' : 'immediate', seats: reduced ? 'reduced' : 'added' })
  )
);

export const trackStartCourse = createWorkspaceEventTracker((eventInfo) => {
  client.analytics.track(
    createWorkspaceEvent(EventName.WORKSPACE_START_COURSE, {...eventInfo})
  );
})
