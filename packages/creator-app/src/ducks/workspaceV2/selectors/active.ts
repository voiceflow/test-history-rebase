import { PlanType } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import { getAlternativeColor } from '@voiceflow/ui';
import { createSelector } from 'reselect';

import { hasOrganizationTrialPermission, hasPlanPermission, hasRolePermission, Permission } from '@/config/permissions';
import { EDITOR_SEAT_ROLES } from '@/constants';
import * as Account from '@/ducks/account';
import * as Feature from '@/ducks/feature';
import * as Session from '@/ducks/session';
import { createCurriedSelector, creatorIDParamSelector } from '@/ducks/utils';

import { getWorkspaceByIDSelector } from './base';

export const workspaceSelector = createSelector([getWorkspaceByIDSelector, Session.activeWorkspaceIDSelector], (getWorkspace, workspaceID) =>
  getWorkspace({ id: workspaceID })
);

export const hasWorkspaceSelector = createSelector([workspaceSelector], (workspace) => !!workspace);

export const organizationTrialExpired = createSelector([workspaceSelector, Feature.isFeatureEnabledSelector], (workspace, isFeatureEnabled) => {
  return isFeatureEnabled(Realtime.FeatureFlag.ENTERPRISE_TRIAL) && workspace?.organizationTrialDaysLeft === 0;
});

export const organizationTrialDaysLeft = createSelector([workspaceSelector, Feature.isFeatureEnabledSelector], (workspace, isFeatureEnabled) => {
  return isFeatureEnabled(Realtime.FeatureFlag.ENTERPRISE_TRIAL) ? workspace?.organizationTrialDaysLeft : null;
});

export const numberOfSeatsSelector = createSelector([workspaceSelector], (workspace) => workspace?.seats);

export const planSelector = createSelector([workspaceSelector], (workspace) => workspace?.plan);

export const isOnPaidPlanSelector = createSelector([planSelector], (plan) => plan && plan !== PlanType.STARTER && plan !== PlanType.OLD_STARTER);

export const membersSelector = createSelector([workspaceSelector], (workspace) => workspace?.members || []);

export const seatLimitsSelector = createSelector([workspaceSelector], (workspace) => workspace?.seatLimits);

export const variableStatesLimitSelector = createSelector([workspaceSelector], (workspace) => workspace?.variableStatesLimit);

export const organizationIDSelector = createSelector([workspaceSelector], (workspace) => workspace?.organizationID);

export const usedEditorSeatsSelector = createSelector(
  [membersSelector],
  (members) => members.filter((member) => EDITOR_SEAT_ROLES.includes(member.role)).length || 1
);

export const usedViewerSeatsSelector = createSelector(
  [membersSelector],
  (members) => members.filter((member) => !EDITOR_SEAT_ROLES.includes(member.role)).length
);

export const memberByIDSelector = createSelector(
  [membersSelector, creatorIDParamSelector],
  (members, creatorID) => members.find((member): member is Realtime.Member => member.creator_id === creatorID) || null
);

export const getMemberByIDSelector = createCurriedSelector(memberByIDSelector);

export const getDistinctWorkspaceMemberByCreatorIDSelector = createSelector(
  [getMemberByIDSelector],
  (getWorkspaceMember) => (creatorID: number, nodeID: string) => {
    const workspaceMember = getWorkspaceMember({ creatorID });

    return workspaceMember ? { ...workspaceMember, color: getAlternativeColor(nodeID) } : null;
  }
);

export const hasMemberByIDSelector = createSelector([getMemberByIDSelector], (getMember) => (creatorID: number) => !!getMember({ creatorID }));

export const userRoleSelector = createSelector([getMemberByIDSelector, Account.userIDSelector], (getMember, creatorID) => {
  if (!creatorID) return null;
  return getMember({ creatorID })?.role;
});

export const hasPermissionSelector = createSelector(
  [userRoleSelector, planSelector, (_: unknown, permission: Permission) => permission, organizationTrialExpired],
  (role, plan, permission, organizationTrialExpired) => {
    const roleAllowed = !!role && hasRolePermission(permission, role);
    const planAllowed = !!plan && hasPlanPermission(permission, plan);
    const trialAllowed = hasOrganizationTrialPermission(permission, organizationTrialExpired);

    return roleAllowed && planAllowed && trialAllowed;
  }
);
