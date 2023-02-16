import * as Realtime from '@voiceflow/realtime-sdk';
import { getAlternativeColor, isColorImage } from '@voiceflow/ui';
import * as Normal from 'normal-store';
import { createSelector } from 'reselect';

import { ENTERPRISE_PLANS, PAID_PLANS } from '@/constants';
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

export const isOnPaidPlanSelector = createSelector([planSelector], (plan) => plan && PAID_PLANS.includes(plan as any));

export const seatLimitsSelector = createSelector([workspaceSelector], (workspace) => workspace?.seatLimits);

export const quotasSelector = createSelector([workspaceSelector], (workspace) => workspace?.quotas);

export const viewerSeatLimitsSelector = createSelector([seatLimitsSelector], (seatLimits) => seatLimits?.viewer ?? 5);

export const variableStatesLimitSelector = createSelector([workspaceSelector], (workspace) => workspace?.variableStatesLimit);

export const organizationIDSelector = createSelector([workspaceSelector], (workspace) => workspace?.organizationID ?? null);

export const membersSelector = createSelector([workspaceSelector], (workspace) => workspace?.members);

export const normalizedMembersSelector = createSelector([membersSelector], (members) => (members ? Normal.denormalize(members) : []));

export const memberByIDSelector = createSelector([membersSelector, creatorIDParamSelector], (members, creatorID) =>
  members && creatorID !== null ? Normal.getOne(members, String(creatorID)) : null
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

export const usedEditorSeatsSelector = createSelector(
  [allNormalizedMembersSelector],
  (members) => members.filter((member) => isEditorUserRole(member.role)).length || 1
);

export const usedViewerSeatsSelector = createSelector(
  [allNormalizedMembersSelector],
  (members) => members.filter((member) => !isEditorUserRole(member.role)).length
);

export const userRoleSelector = createSelector([getMemberByIDSelector, userIDSelector], (getMember, creatorID) => {
  if (!creatorID) return null;
  return getMember({ creatorID })?.role;
});
