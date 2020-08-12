import { createSelector } from 'reselect';

import { Permission, hasRolePermission } from '@/config/permissions';
import { EDITOR_SEAT_ROLES, PlanType, UserRole } from '@/constants';
import { createRootSelector } from '@/ducks/utils';
import { Workspace } from '@/models';
import { NonNullableRecord } from '@/types';
import { getAlternativeColor } from '@/utils/colors';

import { userIDSelector } from '../account';
import { STATE_KEY } from './constants';

const rootSelector = createRootSelector(STATE_KEY);

export const activeWorkspaceIDSelector = createSelector([rootSelector], ({ activeWorkspaceID }) => activeWorkspaceID);

export const workspaceByIDSelector = createSelector([rootSelector], ({ byId }) => (workspaceID: string) => byId[workspaceID]);

export const activeWorkspaceSelector = createSelector([workspaceByIDSelector, activeWorkspaceIDSelector], (getWorkspace, workspaceID) =>
  workspaceID ? getWorkspace(workspaceID) : null
);

export const workspaceNumberOfSeatsSelector = createSelector([activeWorkspaceSelector], (workspace) => workspace?.seats);

export const planTypeSelector = createSelector([activeWorkspaceSelector], (workspace) => workspace?.plan);

export const isOnPaidPlanSelector = createSelector([planTypeSelector], (plan) => plan !== PlanType.STARTER);

export const activeWorkspaceMembersSelector = createSelector([activeWorkspaceSelector], (activeWorkspace) => activeWorkspace?.members || []);

export const activeWorkspaceCommentingMembersSelector = createSelector(
  [activeWorkspaceMembersSelector],
  (members) =>
    members.filter((member: Workspace.Member) => member.name && hasRolePermission(Permission.COMMENTING, member.role)) as NonNullableRecord<
      Workspace.Member
    >[]
);

export const seatLimitsSelector = createSelector([activeWorkspaceSelector], (workspace) => workspace?.seatLimits);

export const isTemplateWorkspaceSelector = createSelector([activeWorkspaceSelector], (workspace) => workspace?.templates);

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

export const activeWorkspaceMemberSelector = createSelector([activeWorkspaceMembersSelector], (members) => (creatorID: string) =>
  members?.find((member) => String(member.creator_id) === creatorID) || null
);

export const anyWorkspaceMemberSelector = createSelector([allWorkspacesSelector], (workspaces) => (creatorID: string) => {
  const allAvailableMembers = workspaces.flatMap((workspace) => workspace.members);

  return allAvailableMembers.find((member) => String(member.creator_id) === creatorID) || null;
});

export const hasWorkspaceMemberSelector = createSelector([activeWorkspaceMemberSelector], (getMember) => (creatorID: string) =>
  !!getMember(creatorID)
);

export const distinctWorkspaceMemberSelector = createSelector(
  [activeWorkspaceMemberSelector],
  (getWorkspaceMember) => (creatorID: string, tabID: string) => {
    const workspaceMember = getWorkspaceMember(creatorID);

    return workspaceMember ? { ...workspaceMember, color: getAlternativeColor(tabID) } : null;
  }
);

export const userRoleSelector = createSelector(
  [activeWorkspaceMemberSelector, userIDSelector],
  (getMember, creatorID) => getMember(String(creatorID))?.role
);

export const isLibraryRoleSelector = createSelector([userRoleSelector], (role) => role === UserRole.LIBRARY);

export const hasTemplateWorkspaceSelector = createSelector([allWorkspacesSelector], (workspaces) => workspaces.some(({ templates }) => templates));
