import { PlanType, UserRole } from '@voiceflow/internal';
import { createSelector } from 'reselect';

import { hasRolePermission, Permission } from '@/config/permissions';
import { EDITOR_SEAT_ROLES } from '@/constants';

import { createCRUDSelectors } from '../utils/crud';
import { creatorIDParamSelector } from '../utils/selector';
import { TEMPLATES_ADMIN_ID, TEMPLATES_EDITORS_ID, WORKSPACE_STATE_KEY } from './constants';

export const {
  all: allWorkspacesSelector,
  root: rootWorkspacesSelector,
  byID: workspaceByIDSelector,
  allIDs: allWorkspaceIDsSelector,
} = createCRUDSelectors(WORKSPACE_STATE_KEY);

export const workspaceMemberByCreatorIDSelector = createSelector(allWorkspacesSelector, creatorIDParamSelector, (workspaces, creatorID) => {
  const allAvailableMembers = workspaces.flatMap((workspace) => workspace.members);

  return allAvailableMembers.find((member) => member.creator_id === creatorID) || null;
});

export const hasTemplatesWorkspaceSelector = createSelector(allWorkspacesSelector, (workspaces) => workspaces.some(({ templates }) => templates));

export const personalWorkspaceIDsSelector = createSelector(allWorkspacesSelector, (workspaces) =>
  workspaces.filter((workspace) => !workspace.templates).map((workspace) => workspace.id)
);

export const isCreatorAdminOfAnyWorkspaceSelector = createSelector(allWorkspacesSelector, creatorIDParamSelector, (workspaces, creatorID) =>
  workspaces.some(({ members }) => members.some(({ creator_id, role }) => creatorID === creator_id && role === UserRole.ADMIN))
);

// workspace

export const workspaceNumberOfSeatsByIDSelector = createSelector(workspaceByIDSelector, (workspace) => workspace?.seats);

export const workspacePlanTypeByIDSelector = createSelector(workspaceByIDSelector, (workspace) => workspace?.plan);

export const workspaceIsOnPaidPlanByIDSelector = createSelector(
  workspacePlanTypeByIDSelector,
  (plan) => plan && plan !== PlanType.STARTER && plan !== PlanType.OLD_STARTER
);

export const workspaceMembersByIDSelector = createSelector(workspaceByIDSelector, (activeWorkspace) => activeWorkspace?.members || []);

export const workspaceCommentingMembersByIDSelector = createSelector(workspaceMembersByIDSelector, (members) =>
  members.filter((member) => member.name && hasRolePermission(Permission.COMMENTING, member.role))
);

export const workspaceSeatLimitsByIDSelector = createSelector(workspaceByIDSelector, (workspace) => workspace?.seatLimits);

export const isTemplateWorkspaceByIDSelector = createSelector(workspaceByIDSelector, (workspace) => workspace?.templates);

export const workspaceUsedEditorSeatsByIDSelector = createSelector(
  workspaceMembersByIDSelector,
  (members) => members.filter((member) => EDITOR_SEAT_ROLES.includes(member.role)).length || 1
);

export const workspaceUsedViewerSeatsByIDSelector = createSelector(
  workspaceMembersByIDSelector,
  (members) => members.filter((member) => !EDITOR_SEAT_ROLES.includes(member.role)).length
);

export const workspaceMemberIDAndCreatorIDSelector = createSelector(
  workspaceMembersByIDSelector,
  creatorIDParamSelector,
  (members, creatorID) => members?.find((member) => member.creator_id === creatorID) || null
);

export const hasWorkspaceMemberByIDAndCreatorIDSelector = createSelector(workspaceMemberIDAndCreatorIDSelector, (member) => !!member);

export const workspaceUserRoleByIDAndCreatorIDSelector = createSelector(
  workspaceByIDSelector,
  workspaceMemberIDAndCreatorIDSelector,
  creatorIDParamSelector,
  (workspace, member, creatorID) => {
    // template workspace has empty members array since the volume can be very high
    if (workspace?.templates && creatorID) {
      if (creatorID === TEMPLATES_ADMIN_ID) return UserRole.ADMIN;
      if (TEMPLATES_EDITORS_ID.includes(creatorID)) return UserRole.EDITOR;

      return UserRole.LIBRARY;
    }

    return member?.role;
  }
);

export const workspaceIsViewerRoleByIDAndCreatorIDSelector = createSelector(
  workspaceUserRoleByIDAndCreatorIDSelector,
  (role) => role === UserRole.VIEWER
);

export const workspaceIsLibraryRoleByIDAndCreatorIDSelector = createSelector(
  workspaceUserRoleByIDAndCreatorIDSelector,
  (role) => role === UserRole.LIBRARY
);

export const workspaceIsViewerOrLibraryRoleByIDAndCreatorIDSelector = createSelector(
  [workspaceIsViewerRoleByIDAndCreatorIDSelector, workspaceIsLibraryRoleByIDAndCreatorIDSelector],
  (isViewer, isLibrary) => isViewer || isLibrary
);
