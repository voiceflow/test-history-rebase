import { UserRole } from '@voiceflow/internal';
import { ArrayItem } from '@voiceflow/realtime-sdk';

import { ALL_VIRTUAL_ROLES, EDITOR_USER_ROLES, OWNER_AND_ADMIN_ROLES, VirtualRole } from '@/constants/roles';

export const isVirtualRole = (role: UserRole | VirtualRole): role is VirtualRole => ALL_VIRTUAL_ROLES.includes(role as any);

export const isEditorUserRole = (role: UserRole | VirtualRole): role is ArrayItem<typeof EDITOR_USER_ROLES> =>
  EDITOR_USER_ROLES.includes(role as any);

export const isAdminOrOwnerUserRole = (role: UserRole | VirtualRole): role is ArrayItem<typeof OWNER_AND_ADMIN_ROLES> =>
  OWNER_AND_ADMIN_ROLES.includes(role as any);
