import { createSelector } from 'reselect';

import { EDITOR_SEAT_ROLES, PlanType } from '@/constants';
import { createRootSelector } from '@/ducks/utils';
import { getAlternativeColor } from '@/utils/colors';

import { STATE_KEY } from './constants';

const rootSelector = createRootSelector(STATE_KEY);

export const activeWorkspaceIDSelector = createSelector([rootSelector], ({ activeWorkspaceID }) => activeWorkspaceID);

export const workspaceByIDSelector = createSelector([rootSelector], ({ byId }) => (workspaceID: string) => byId[workspaceID]);

export const activeWorkspaceSelector = createSelector([workspaceByIDSelector, activeWorkspaceIDSelector], (getWorkspace, workspaceID) =>
  getWorkspace(workspaceID!)
);

export const workspaceNumberOfSeatsSelector = createSelector([activeWorkspaceSelector], ({ seats }) => seats);

export const planTypeSelector = createSelector([activeWorkspaceSelector], ({ plan }) => plan);

export const isOnPaidPlanSelector = createSelector([planTypeSelector], (plan) => plan !== PlanType.STARTER);

export const activeWorkspaceMembersSelector = createSelector([activeWorkspaceSelector], (activeWorkspace) => activeWorkspace?.members || []);

export const seatLimitsSelector = createSelector([activeWorkspaceSelector], ({ seatLimits }) => seatLimits);

export const usedEditorSeatsSelector = createSelector(
  [activeWorkspaceMembersSelector],
  (members) => members.filter((member) => EDITOR_SEAT_ROLES.includes(member.role)).length || 1
);

export const usedViewerSeatsSelector = createSelector(
  [activeWorkspaceMembersSelector],
  (members) => members.filter((member) => !EDITOR_SEAT_ROLES.includes(member.role)).length
);

export const allWorkspaceIdsSelector = createSelector([rootSelector], ({ allIds }) => allIds || []);

export const allWorkspacesSelector = createSelector([rootSelector], ({ allIds, byId }) => allIds.map((workspaceID) => byId[workspaceID]));

export const workspaceMemberSelector = createSelector([activeWorkspaceMembersSelector], (members) => (creatorID: string) =>
  members?.find((member) => String(member.creator_id) === creatorID) || null
);

export const hasWorkspaceMemberSelector = createSelector([workspaceMemberSelector], (getMember) => (creatorID: string) => !!getMember(creatorID));

export const distinctWorkspaceMemberSelector = createSelector(
  [workspaceMemberSelector],
  (getWorkspaceMember) => (creatorID: string, tabID: string) => {
    const workspaceMember = getWorkspaceMember(creatorID);

    return workspaceMember ? { ...workspaceMember, color: getAlternativeColor(tabID) } : null;
  }
);
