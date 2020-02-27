import { createSelector } from 'reselect';

import { EDITOR_SEAT_ROLES } from '@/constants';
import { createRootSelector } from '@/ducks/utils';
import { getAlternativeColor } from '@/utils/colors';

import { STATE_KEY } from './constants';

const rootSelector = createRootSelector(STATE_KEY);

export const activeWorkspaceIDSelector = createSelector(rootSelector, ({ activeWorkspaceID }) => activeWorkspaceID);

export const activeWorkspaceSelector = createSelector(rootSelector, activeWorkspaceIDSelector, ({ byId }, workspaceID) => byId[workspaceID]);

export const workspaceNumberOfSeatsSelector = createSelector(activeWorkspaceSelector, ({ seats }) => seats);

export const planTypeSelector = createSelector(activeWorkspaceSelector, ({ plan }) => plan);

export const onPaidPlan = createSelector(planTypeSelector, (plan) => !!plan);

export const workspaceByIDSelector = createSelector(rootSelector, ({ byId }) => (workspaceID) => byId[workspaceID]);

export const activeWorkspaceMembersSelector = createSelector(activeWorkspaceSelector, (activeWorkspace) => activeWorkspace?.members || []);

export const seatLimits = createSelector(activeWorkspaceSelector, ({ seatLimits }) => seatLimits);

export const usedEditorSeats = createSelector(
  activeWorkspaceMembersSelector,
  (members) => members.filter((member) => EDITOR_SEAT_ROLES.includes(member.role)).length || 1
);

export const usedViewerSeats = createSelector(
  activeWorkspaceMembersSelector,
  (members) => members.filter((member) => !EDITOR_SEAT_ROLES.includes(member.role)).length
);

export const allWorkspacesSelector = createSelector(rootSelector, ({ allIds, byId }) => allIds.map((workspaceID) => byId[workspaceID]));

export const workspaceMemberSelector = createSelector(activeWorkspaceMembersSelector, (members) => (creatorID) =>
  members?.find((member) => String(member.creator_id) === creatorID) || null
);

export const distinctWorkspaceMemberSelector = createSelector(workspaceMemberSelector, (getWorkspaceMember) => (creatorID, tabID) => {
  const workspaceMember = getWorkspaceMember(creatorID);

  return workspaceMember ? { ...workspaceMember, color: getAlternativeColor(tabID) } : null;
});
