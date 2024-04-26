import { USER_ROLE_STRENGTH } from '@realtime-sdk/constants/user';
import type { UserRole } from '@voiceflow/internal';

export const getRoleStrength = (role: UserRole): number => USER_ROLE_STRENGTH[role];

export const isRoleAStrongerRoleB = (roleA: UserRole, roleB: UserRole): boolean =>
  getRoleStrength(roleA) > getRoleStrength(roleB);
