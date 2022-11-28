import { UserRole } from '@voiceflow/internal';

// higher roles have higher strength
export const USER_ROLE_STRENGTH: Record<string, number> = {
  [UserRole.OWNER]: 5,
  [UserRole.ADMIN]: 4,
  [UserRole.EDITOR]: 3,
  [UserRole.BILLING]: 2,
  [UserRole.VIEWER]: 1,
};
