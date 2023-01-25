import { UserRole } from '@voiceflow/internal';

// higher roles have higher strength
export const USER_ROLE_STRENGTH: Record<UserRole, number> = {
  [UserRole.OWNER]: 50,
  [UserRole.ADMIN]: 40,
  [UserRole.EDITOR]: 30,
  [UserRole.BILLING]: 20,
  [UserRole.VIEWER]: 10,
};
