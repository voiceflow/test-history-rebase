import { UserRole } from '@voiceflow/dtos';
import { UserRole as InternalUserRole } from '@voiceflow/internal';

// higher roles have higher strength
export const LEGACY_USER_ROLE_STRENGTH: Record<InternalUserRole, number> = {
  [InternalUserRole.OWNER]: 50,
  [InternalUserRole.ADMIN]: 40,
  [InternalUserRole.EDITOR]: 30,
  [InternalUserRole.BILLING]: 20,
  [InternalUserRole.VIEWER]: 10,
};

export const USER_ROLE_STRENGTH: Record<UserRole, number> = {
  [UserRole.OWNER]: 50,
  [UserRole.ADMIN]: 40,
  [UserRole.EDITOR]: 30,
  [UserRole.BILLING]: 20,
  [UserRole.VIEWER]: 10,
  [UserRole.GUEST]: 0,
};
