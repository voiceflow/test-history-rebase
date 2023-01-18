import { Utils } from '@voiceflow/common';
import { UserRole } from '@voiceflow/internal';

import { ROLE_PERMISSIONS, RolePermissionKey, RolePermissions } from '@/config/rolePermission';
import { Permission } from '@/constants/permissions';
import { VirtualRole } from '@/constants/roles';

export type RolePermissionConfig<P extends Permission> = P extends RolePermissionKey ? RolePermissions[P] : never;

export const isSupportedRolePermission = (permission: Permission): permission is RolePermissionKey => permission in ROLE_PERMISSIONS;

/**
 * returns role permission config, `null` if permission is not supported or permission is allowed for the role
 */
export const getRolePermissionConfig = <P extends Permission>(permission: P, role: UserRole | VirtualRole): RolePermissionConfig<P> | null => {
  if (!isSupportedRolePermission(permission)) return null;

  const rolePermissionConfig = ROLE_PERMISSIONS[permission] as RolePermissionConfig<P>;

  return Utils.array.inferUnion<Array<UserRole | VirtualRole>>(rolePermissionConfig.roles).includes(role) ? null : rolePermissionConfig;
};

export const hasRolePermission = (permission: Permission, role: UserRole | VirtualRole): boolean =>
  getRolePermissionConfig(permission, role) === null;
