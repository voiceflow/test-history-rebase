import { Utils } from '@voiceflow/common';
import { PlanType } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import { getAlternativeColor, isColorImage } from '@voiceflow/ui';
import * as Normal from 'normal-store';
import { createSelector } from 'reselect';

import { EDITOR_DEFAULT_LIMIT, ENTERPRISE_PLANS, PAID_PLANS, PROJECTS_DEFAULT_LIMIT, TEAM_PLANS, VIEWERS_DEFAULT_LIMIT } from '@/constants';
import { userIDSelector } from '@/ducks/account/selectors';
import * as Feature from '@/ducks/feature';
import { getOrganizationByIDSelector } from '@/ducks/organization/selectors/crud';
import { allEditorMemberIDs as allProjectsEditorMemberIDs } from '@/ducks/projectV2/selectors/base';
import * as Session from '@/ducks/session';
import { createCurriedSelector, creatorIDParamSelector } from '@/ducks/utils';
import { idsParamSelector } from '@/ducks/utils/crudV2';
import { isAdminUserRole, isEditorUserRole } from '@/utils/role';

import { getWorkspaceByIDSelector } from './base';

export const workspaceSelector = createSelector([getWorkspaceByIDSelector, Session.activeWorkspaceIDSelector], (getWorkspace, workspaceID) =>
  getWorkspace({ id: workspaceID })
);

export const hasWorkspaceSelector = createSelector([workspaceSelector], (workspace) => !!workspace);

// TODO: move into organization duck when migrated to new trial system
export const organizationTrialDaysLeftSelector = createSelector(
  [workspaceSelector, Feature.isFeatureEnabledSelector, getOrganizationByIDSelector],
  (workspace, isFeatureEnabled, getOrganizationByID) => {
    if (isFeatureEnabled(Realtime.FeatureFlag.ENTERPRISE_TRIAL) || isFeatureEnabled(Realtime.FeatureFlag.PRO_REVERSE_TRIAL)) {
      // calling the organization duck selector causes a initilization error
      const organization = workspace?.organizationID ? getOrganizationByID({ id: workspace.organizationID }) : null;

      // FIXME: this is a hack to get the trial days left for the organization.
      // As we are still migrating the trial system, we need to check both the workspace and the organization.
      return workspace?.organizationTrialDaysLeft ?? organization?.trial?.daysLeft ?? null;
    }

    return null;
  }
);

export const organizationTrialEndAtSelector = createSelector(
  [workspaceSelector, Feature.isFeatureEnabledSelector, getOrganizationByIDSelector],
  (workspace, isFeatureEnabled, getOrganizationByID) => {
    if (isFeatureEnabled(Realtime.FeatureFlag.PRO_REVERSE_TRIAL)) {
      // calling the organization duck selector causes a initilization error
      const organization = workspace?.organizationID ? getOrganizationByID({ id: workspace.organizationID }) : null;
      return organization?.trial?.endAt ?? null;
    }

    return null;
  }
);

// TODO: move into organization duck when migrated to new trial system
export const organizationTrialExpiredSelector = createSelector([organizationTrialDaysLeftSelector], (daysLeft) => daysLeft === 0);

export const isOnTrialSelector = createSelector([organizationTrialDaysLeftSelector], (daysLeft) => daysLeft !== null);

export const isOnProTrialSelector = createSelector(
  [workspaceSelector, isOnTrialSelector],
  (workspace, isOnTrial) => isOnTrial && workspace?.plan === PlanType.PRO
);

export const numberOfSeatsSelector = createSelector([workspaceSelector], (workspace) => workspace?.seats ?? 1);

export const planSelector = createSelector([workspaceSelector], (workspace) => workspace?.plan ?? null);

export const isEnterpriseSelector = createSelector([planSelector], (plan) => plan && ENTERPRISE_PLANS.includes(plan as any));

export const isProSelector = createSelector([planSelector], (plan) => plan && plan === PlanType.PRO);

export const isTeamSelector = createSelector([planSelector], (plan) => plan && TEAM_PLANS.includes(plan as any));

export const isOnPaidPlanSelector = createSelector([planSelector], (plan) => plan && PAID_PLANS.includes(plan as any));

export const planSeatLimitsSelector = createSelector([workspaceSelector], (workspace) => workspace?.planSeatLimits);

export const nameSelector = createSelector([workspaceSelector], (workspace) => workspace?.name);

export const imageSelector = createSelector([workspaceSelector], (workspace) => workspace?.image);

export const stateSelector = createSelector([workspaceSelector], (workspace) => workspace?.state);

export const stripeStatusSelector = createSelector([workspaceSelector], (workspace) => workspace?.stripeStatus);

export const settingsSelector = createSelector([workspaceSelector], (workspace) => workspace?.settings);

export const dashboardKanbanSettingsSelector = createSelector([settingsSelector], (settings) => settings?.dashboardKanban);

export const isLockedSelector = createSelector([stateSelector], (state) => state === Realtime.WorkspaceActivationState.LOCKED);

export const projectsLimitSelector = createSelector([workspaceSelector], (workspace) => workspace?.projects ?? PROJECTS_DEFAULT_LIMIT);

export const quotasSelector = createSelector([workspaceSelector], (workspace) => workspace?.quotas);

export const viewerPlanSeatLimitsSelector = createSelector(
  [planSeatLimitsSelector],
  (planSeatLimits) => planSeatLimits?.viewer ?? VIEWERS_DEFAULT_LIMIT
);

export const editorPlanSeatLimitsSelector = createSelector(
  [planSeatLimitsSelector],
  (planSeatLimits) => planSeatLimits?.editor ?? EDITOR_DEFAULT_LIMIT
);

export const variableStatesLimitSelector = createSelector([workspaceSelector], (workspace) => workspace?.variableStatesLimit);

export const organizationIDSelector = createSelector([workspaceSelector], (workspace) => workspace?.organizationID ?? null);

export const membersSelector = createSelector([workspaceSelector], (workspace) => workspace?.members);

export const normalizedMembersSelector = createSelector([membersSelector], (members) => (members ? Normal.denormalize(members) : []));

export const memberByIDSelector = createSelector([membersSelector, creatorIDParamSelector], (members, creatorID) =>
  members && creatorID !== null ? Normal.getOne(members, String(creatorID)) : null
);

export const membersByIDsSelector = createSelector([membersSelector, idsParamSelector], (members, ids) =>
  members ? Normal.getMany(members, ids) : []
);

export const getMemberByIDSelector = createCurriedSelector(memberByIDSelector);

export const getDistinctMemberByCreatorIDSelector = createSelector(
  [getMemberByIDSelector],
  (getWorkspaceMember) => (creatorID: number, nodeID: string) => {
    const workspaceMember = getWorkspaceMember({ creatorID });

    return workspaceMember
      ? { ...workspaceMember, color: isColorImage(workspaceMember.image) ? workspaceMember.image : getAlternativeColor(nodeID) }
      : null;
  }
);

export const hasMemberByIDSelector = createSelector([getMemberByIDSelector], (getMember) => (creatorID: number) => !!getMember({ creatorID }));

export const pendingMembersSelector = createSelector([workspaceSelector], (workspace) => workspace?.pendingMembers);

export const normalizedPendingMembersSelector = createSelector([pendingMembersSelector], (pendingMembers) =>
  pendingMembers ? Normal.denormalize(pendingMembers) : []
);

export const allNormalizedMembersSelector = createSelector(
  [normalizedMembersSelector, normalizedPendingMembersSelector],
  (members, pendingMembers): Realtime.AnyWorkspaceMember[] => [...members, ...pendingMembers]
);

export const allNormalizedMembersCountSelector = createSelector([allNormalizedMembersSelector], (members) => members.length);

export const editorMemberIDsSelector = createSelector([allNormalizedMembersSelector], (members) =>
  members.filter((member) => isEditorUserRole(member.role)).map((member) => member.creator_id)
);

export const usedEditorSeatsSelector = createSelector(
  [editorMemberIDsSelector, allProjectsEditorMemberIDs],
  (memberIDs, projectMemberIDs) => Utils.array.unique([...memberIDs, ...projectMemberIDs]).length || 1
);

export const usedViewerSeatsSelector = createSelector(
  [allNormalizedMembersSelector],
  (members) => members.filter((member) => !isEditorUserRole(member.role)).length
);

export const userRoleSelector = createSelector([getMemberByIDSelector, userIDSelector], (getMember, creatorID) => {
  if (!creatorID) return null;

  return getMember({ creatorID })?.role ?? null;
});

export const isLastAdminSelector = createSelector(
  [allNormalizedMembersSelector],
  (members) => members.filter((member) => isAdminUserRole(member.role)).length <= 1
);
