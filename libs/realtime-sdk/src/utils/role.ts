import type { UserRole } from '@voiceflow/internal';

import { USER_ROLE_STRENGTH } from '@/constants/user';

export const getRoleStrength = (role: UserRole): number => USER_ROLE_STRENGTH[role];

export const isRoleAStrongerRoleB = (roleA: UserRole, roleB: UserRole): boolean =>
  getRoleStrength(roleA) > getRoleStrength(roleB);
