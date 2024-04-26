import type { Nullish } from '@voiceflow/common';
import type { UserRole } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';

import type { VirtualRole } from '@/constants/roles';
import {
  ADMIN_ROLES,
  ALL_VIRTUAL_ROLES,
  EDITOR_USER_ROLES,
  VIEWER_USER_ROLES,
  VIRTUAL_ROLE_STRENGTH,
} from '@/constants/roles';

export const isVirtualRole = (role: Nullish<UserRole | VirtualRole>): role is VirtualRole =>
  ALL_VIRTUAL_ROLES.includes(role as any);

export const isEditorUserRole = (
  role: Nullish<UserRole | VirtualRole>
): role is Realtime.ArrayItem<typeof EDITOR_USER_ROLES> => EDITOR_USER_ROLES.includes(role as any);

export const isAdminUserRole = (
  role: Nullish<UserRole | VirtualRole>
): role is Realtime.ArrayItem<typeof ADMIN_ROLES> => ADMIN_ROLES.includes(role as any);

export const isViewerUserRole = (role: UserRole): role is Realtime.ArrayItem<typeof VIEWER_USER_ROLES> =>
  VIEWER_USER_ROLES.includes(role);

export const getVirtualRoleStrength = (role: VirtualRole) => VIRTUAL_ROLE_STRENGTH[role];

export const getRoleStrength = (role: VirtualRole | UserRole) =>
  isVirtualRole(role) ? getVirtualRoleStrength(role) : Realtime.Utils.role.getRoleStrength(role);

export const isRoleAStrongerRoleB = (roleA: VirtualRole | UserRole, roleB: VirtualRole | UserRole): boolean =>
  getRoleStrength(roleA) > getRoleStrength(roleB);
