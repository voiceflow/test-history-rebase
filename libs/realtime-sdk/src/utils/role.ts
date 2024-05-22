import { LEGACY_USER_ROLE_STRENGTH, USER_ROLE_STRENGTH } from '@realtime-sdk/constants/user';
import { UserRole } from '@voiceflow/dtos';
import { UserRole as InternalUserRole } from '@voiceflow/internal';

export const getRoleStrength = (role: UserRole): number => USER_ROLE_STRENGTH[role];

export const isRoleAStrongerRoleB = (roleA: UserRole, roleB: UserRole): boolean =>
  getRoleStrength(roleA) > getRoleStrength(roleB);

/**
 * @deprecated this function uses user role from internal package. We should use getRoleStrength and UserRoles from @voiceflow/dtos package
 */
export const getLegacyRoleStrength = (role: InternalUserRole): number => LEGACY_USER_ROLE_STRENGTH[role];

/**
 * @deprecated this function uses user role from internal package. We should use getRoleStrength and UserRoles from @voiceflow/dtos package
 */
export const isLegacyRoleAStrongerRoleB = (roleA: InternalUserRole, roleB: InternalUserRole): boolean =>
  getLegacyRoleStrength(roleA) > getLegacyRoleStrength(roleB);
