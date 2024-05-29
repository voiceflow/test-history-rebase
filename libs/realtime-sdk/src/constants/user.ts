import { UserRole } from '@voiceflow/dtos';

export const USER_ROLE_STRENGTH: Record<UserRole, number> = {
  [UserRole.ADMIN]: 40,
  [UserRole.EDITOR]: 30,
  [UserRole.BILLING]: 20,
  [UserRole.VIEWER]: 10,
  [UserRole.GUEST]: 0,
};
