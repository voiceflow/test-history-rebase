import { Nullish } from '@voiceflow/common';
import { UserRole } from '@voiceflow/dtos';
import { UserRole as InternalUserRole } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';

import {
  ADMIN_ROLES,
  ALL_VIRTUAL_ROLES,
  EDITOR_USER_ROLES,
  VIEWER_USER_ROLES,
  VIRTUAL_ROLE_STRENGTH,
  VirtualRole,
} from '@/constants/roles';

export const isVirtualRole = (role: Nullish<UserRole | InternalUserRole | VirtualRole>): role is VirtualRole =>
  ALL_VIRTUAL_ROLES.includes(role as any);

export const isEditorUserRole = (
  role: Nullish<UserRole | InternalUserRole | VirtualRole>
): role is Realtime.ArrayItem<typeof EDITOR_USER_ROLES> => EDITOR_USER_ROLES.includes(role as any);

export const isAdminUserRole = (
  role: Nullish<UserRole | InternalUserRole | VirtualRole>
): role is Realtime.ArrayItem<typeof ADMIN_ROLES> => ADMIN_ROLES.includes(role as any);

export const isViewerUserRole = (
  role: UserRole | InternalUserRole
): role is Realtime.ArrayItem<typeof VIEWER_USER_ROLES> => VIEWER_USER_ROLES.includes(role as any);

export const getVirtualRoleStrength = (role: VirtualRole) => VIRTUAL_ROLE_STRENGTH[role];

export const getRoleStrength = (role: VirtualRole | UserRole | InternalUserRole) =>
  isVirtualRole(role) ? getVirtualRoleStrength(role) : Realtime.Utils.role.getRoleStrength(role);

export const isRoleAStrongerRoleB = (
  roleA: VirtualRole | UserRole | InternalUserRole,
  roleB: VirtualRole | UserRole | InternalUserRole
): boolean => getRoleStrength(roleA) > getRoleStrength(roleB);
