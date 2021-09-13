import { PlanType, UserRole } from '@voiceflow/internal';
import { getAlternativeColor } from '@voiceflow/ui';
import { createSelector } from 'reselect';

import { hasPlanPermission, hasRolePermission, Permission } from '@/config/permissions';
import { EDITOR_SEAT_ROLES } from '@/constants';
import * as Account from '@/ducks/account';
import * as Session from '@/ducks/session';
import { creatorIDParamSelector } from '@/ducks/utils';

import { TEMPLATES_ADMIN_ID, TEMPLATES_EDITORS_ID } from '../constants';
import { getWorkspaceByIDSelector } from './base';

export const workspaceSelector = createSelector([getWorkspaceByIDSelector, Session.activeWorkspaceIDSelector], (getWorkspace, workspaceID) =>
  workspaceID ? getWorkspace(workspaceID) : null
);

export const numberOfSeatsSelector = createSelector([workspaceSelector], (workspace) => workspace?.seats);

export const planSelector = createSelector([workspaceSelector], (workspace) => workspace?.plan);

export const isOnPaidPlanSelector = createSelector([planSelector], (plan) => plan && plan !== PlanType.STARTER && plan !== PlanType.OLD_STARTER);

export const membersSelector = createSelector([workspaceSelector], (workspace) => workspace?.members || []);

export const seatLimitsSelector = createSelector([workspaceSelector], (workspace) => workspace?.seatLimits);

export const usedEditorSeatsSelector = createSelector(
  [membersSelector],
  (members) => members.filter((member) => EDITOR_SEAT_ROLES.includes(member.role)).length || 1
);

export const usedViewerSeatsSelector = createSelector(
  [membersSelector],
  (members) => members.filter((member) => !EDITOR_SEAT_ROLES.includes(member.role)).length
);

export const isTemplatesSelector = createSelector([workspaceSelector], (workspace) => !!workspace?.templates);

export const memberByIDSelector = createSelector(
  [membersSelector, creatorIDParamSelector],
  (members, creatorID) => members.find((member) => member.creator_id === creatorID) || null
);

export const getMemberByIDSelector = createSelector(
  [membersSelector],
  (members) => (creatorID: number) => members.find((member) => member.creator_id === creatorID) || null
);

export const getDistinctWorkspaceMemberByCreatorIDSelector = createSelector(
  [getMemberByIDSelector],
  (getWorkspaceMember) => (creatorID: number, tabID: string) => {
    const workspaceMember = getWorkspaceMember(creatorID);
    return workspaceMember ? { ...workspaceMember, color: getAlternativeColor(tabID) } : null;
  }
);

export const hasMemberByIDSelector = createSelector([getMemberByIDSelector], (getMember) => (creatorID: number) => !!getMember(creatorID));

export const userRoleSelector = createSelector(
  [getMemberByIDSelector, workspaceSelector, Account.userIDSelector],
  (getMember, workspace, creatorID) => {
    // template workspace has empty members array since the volume can be very high
    if (workspace?.templates && creatorID) {
      if (creatorID === TEMPLATES_ADMIN_ID) return UserRole.ADMIN;

      if (TEMPLATES_EDITORS_ID.includes(creatorID)) return UserRole.EDITOR;

      return UserRole.LIBRARY;
    }

    return creatorID ? getMember(creatorID)?.role : null;
  }
);

export const hasPermissionSelector = createSelector(
  [userRoleSelector, planSelector, (_: unknown, permission: Permission) => permission],
  (role, plan, permission) => {
    const roleAllowed = !!role && hasRolePermission(permission, role);
    const planAllowed = !!plan && hasPlanPermission(permission, plan);

    return roleAllowed && planAllowed;
  }
);
