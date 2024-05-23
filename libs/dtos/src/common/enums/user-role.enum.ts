import type { Enum } from '@/utils/type/enum.util';

export const UserRole = {
  ADMIN: 'admin',
  OWNER: 'owner',
  EDITOR: 'editor',
  VIEWER: 'viewer',
  BILLING: 'billing',
  GUEST: 'guest',
} as const;

export type UserRole = Enum<typeof UserRole>;
