import { Utils } from '@voiceflow/common';
import type { UserRole } from '@voiceflow/dtos';

import type { RolePermissionKey, RolePermissions } from '@/config/rolePermission';
import { ROLE_PERMISSIONS } from '@/config/rolePermission';
import type { Permission } from '@/constants/permissions';
import type { VirtualRole } from '@/constants/roles';

export type RolePermissionConfig<P extends Permission> = P extends RolePermissionKey ? RolePermissions[P] : never;

export const isSupportedRolePermission = (permission: Permission): permission is RolePermissionKey =>
  permission in ROLE_PERMISSIONS;

export const getRolePermissionConfig = <P extends Permission>(permission: P): RolePermissionConfig<P> | null => {
  if (!isSupportedRolePermission(permission)) return null;

  return ROLE_PERMISSIONS[permission] as RolePermissionConfig<P>;
};

/**
 * returns role permission config, `null` if permission is not supported or permission is allowed for the role
 */
export const verifyRolePermissionConfig = <P extends Permission>(
  permission: P,
  role: UserRole | VirtualRole
): RolePermissionConfig<P> | null => {
  const rolePermissionConfig = getRolePermissionConfig(permission);

  if (!rolePermissionConfig) return null;

  return Utils.array.inferUnion<Array<UserRole | VirtualRole>>(rolePermissionConfig.roles).includes(role)
    ? null
    : rolePermissionConfig;
};

export const hasRolePermission = (permission: Permission, role: UserRole | VirtualRole): boolean =>
  verifyRolePermissionConfig(permission, role) === null;
