import { createSelector } from 'reselect';

import { hasRolePermission, Permission } from '@/config/permissions';
import { EDITOR_SEAT_ROLES, PlanType, UserRole } from '@/constants';
import { userIDSelector } from '@/ducks/account/selectors';
import * as Session from '@/ducks/session';
import * as CRUD from '@/ducks/utils/crud';
import { Workspace } from '@/models';
import { NonNullableRecord } from '@/types';
import { getAlternativeColor } from '@/utils/colors';

import { STATE_KEY, TEMPLATES_ADMIN_ID, TEMPLATES_EDITORS_ID } from './constants';

export const {
  root: rootWorkspacesSelector,
  all: allWorkspacesSelector,
  allIDs: allWorkspaceIDsSelector,
  byID: workspaceByIDSelector,
  findByIDs: workspacesByIDsSelector,
  has: hasWorkspacesSelector,
} = CRUD.createCRUDSelectors(STATE_KEY);

export const anyWorkspaceMemberSelector = createSelector([allWorkspacesSelector], (workspaces) => (creatorID: string) => {
  const allAvailableMembers = workspaces.flatMap((workspace) => workspace.members);

  return allAvailableMembers.find((member) => String(member.creator_id) === creatorID) || null;
});

export const hasTemplatesWorkspaceSelector = createSelector([allWorkspacesSelector], (workspaces) => workspaces.some(({ templates }) => templates));

export const personalWorkspaceIDsSelector = createSelector([allWorkspacesSelector], (workspaces) =>
  workspaces.filter((workspace) => !workspace.templates).map((workspace) => workspace.id)
);

export const isAdminOfAnyWorkspaceSelector = createSelector([allWorkspacesSelector, userIDSelector], (workspaces, userID) =>
  workspaces.some(({ members }) => members.some(({ creator_id, role }) => userID === creator_id && role === UserRole.ADMIN))
);

// active project

export const activeProjectWorkspaceSelector = createSelector([allWorkspacesSelector, Session.activeProjectIDSelector], (workspaces, projectID) =>
  projectID ? workspaces.find(({ boards }) => boards.find(({ projects }) => projects.includes(projectID))) : null
);

// active workspace

export const activeWorkspaceSelector = createSelector([workspaceByIDSelector, Session.activeWorkspaceIDSelector], (getWorkspace, workspaceID) =>
  workspaceID ? getWorkspace(workspaceID) : null
);

export const workspaceNumberOfSeatsSelector = createSelector([activeWorkspaceSelector], (workspace) => workspace?.seats);

export const planTypeSelector = createSelector([activeWorkspaceSelector], (workspace) => workspace?.plan);

export const isOnPaidPlanSelector = createSelector([planTypeSelector], (plan) => plan && plan !== PlanType.STARTER && plan !== PlanType.OLD_STARTER);

export const activeWorkspaceMembersSelector = createSelector([activeWorkspaceSelector], (activeWorkspace) => activeWorkspace?.members || []);

export const activeWorkspaceCommentingMembersSelector = createSelector(
  [activeWorkspaceMembersSelector],
  (members) =>
    members.filter(
      (member: Workspace.Member) => member.name && hasRolePermission(Permission.COMMENTING, member.role)
    ) as NonNullableRecord<Workspace.Member>[]
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

export const activeWorkspaceMemberSelector = createSelector(
  [activeWorkspaceMembersSelector],
  (members) => (creatorID: string) => members?.find((member) => String(member.creator_id) === creatorID) || null
);

export const hasWorkspaceMemberSelector = createSelector(
  [activeWorkspaceMemberSelector],
  (getMember) => (creatorID: string) => !!getMember(creatorID)
);

export const distinctWorkspaceMemberSelector = createSelector(
  [activeWorkspaceMemberSelector],
  (getWorkspaceMember) => (creatorID: string, tabID: string) => {
    const workspaceMember = getWorkspaceMember(creatorID);
    return workspaceMember ? { ...workspaceMember, color: getAlternativeColor(tabID) } : null;
  }
);

export const userRoleSelector = createSelector(
  [activeWorkspaceMemberSelector, activeWorkspaceSelector, userIDSelector],
  (getMember, workspace, creatorID) => {
    // template workspace has empty members array since the volume can be very high
    if (workspace?.templates && creatorID) {
      if (creatorID === TEMPLATES_ADMIN_ID) return UserRole.ADMIN;

      if (TEMPLATES_EDITORS_ID.includes(creatorID)) return UserRole.EDITOR;

      return UserRole.LIBRARY;
    }
    return getMember(String(creatorID))?.role;
  }
);

export const isViewerRoleSelector = createSelector([userRoleSelector], (role) => role === UserRole.VIEWER);

export const isLibraryRoleSelector = createSelector([userRoleSelector], (role) => role === UserRole.LIBRARY);

export const isViewerOrLibraryRoleSelector = createSelector(
  [isViewerRoleSelector, isLibraryRoleSelector],
  (isViewer, isLibrary) => isViewer || isLibrary
);
