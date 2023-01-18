import { Utils } from '@voiceflow/common';
import { PlanType } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import { getAlternativeColor } from '@voiceflow/ui';
import { createSelector } from 'reselect';

import { ENTERPRISE_PLANS } from '@/constants';
import { userIDSelector } from '@/ducks/account/selectors';
import * as Feature from '@/ducks/feature';
import * as Session from '@/ducks/session';
import { createCurriedSelector, creatorIDParamSelector } from '@/ducks/utils';
import { isEditorUserRole } from '@/utils/role';

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

export const numberOfSeatsSelector = createSelector([workspaceSelector], (workspace) => workspace?.seats ?? 1);

export const planSelector = createSelector([workspaceSelector], (workspace) => workspace?.plan);

export const isEnterpriseSelector = createSelector([planSelector], (plan) => plan && ENTERPRISE_PLANS.includes(plan as any));

export const isOnPaidPlanSelector = createSelector([planSelector], (plan) => plan && plan !== PlanType.STARTER && plan !== PlanType.OLD_STARTER);

export const membersSelector = createSelector([workspaceSelector], (workspace) => workspace?.members || []);

export const membersCountSelector = createSelector([membersSelector], (members) => members.length);

export const activeMembersSelector = createSelector([membersSelector], (members) => members.filter(Realtime.Utils.typeGuards.isWorkspaceMember));

export const activeMembersMapSelector = createSelector([activeMembersSelector], (members) =>
  Utils.array.createMap(members, (member) => member.creator_id)
);

export const seatLimitsSelector = createSelector([workspaceSelector], (workspace) => workspace?.seatLimits);

export const viewerSeatLimitsSelector = createSelector([seatLimitsSelector], (seatLimits) => seatLimits?.viewer ?? 5);

export const variableStatesLimitSelector = createSelector([workspaceSelector], (workspace) => workspace?.variableStatesLimit);

export const organizationIDSelector = createSelector([workspaceSelector], (workspace) => workspace?.organizationID ?? null);

export const usedEditorSeatsSelector = createSelector(
  [membersSelector],
  (members) => members.filter((member) => isEditorUserRole(member.role)).length || 1
);

export const usedViewerSeatsSelector = createSelector(
  [membersSelector],
  (members) => members.filter((member) => !isEditorUserRole(member.role)).length
);

export const memberByIDSelector = createSelector(
  [membersSelector, creatorIDParamSelector],
  (members, creatorID) => members.find((member): member is Realtime.WorkspaceMember => member.creator_id === creatorID) || null
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

export const userRoleSelector = createSelector([getMemberByIDSelector, userIDSelector], (getMember, creatorID) => {
  if (!creatorID) return null;
  return getMember({ creatorID })?.role;
});

export const workspaceQuotasSelector = createSelector([workspaceSelector], (workspace) => workspace?.quotas);
