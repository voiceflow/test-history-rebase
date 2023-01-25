import { UserRole } from '@voiceflow/internal';

import { ALL_VIRTUAL_ROLES, EDITOR_USER_ROLES, OWNER_AND_ADMIN_ROLES, VirtualRole } from '@/constants/roles';

export const isVirtualRole = (role: UserRole | VirtualRole): role is VirtualRole => ALL_VIRTUAL_ROLES.includes(role as any);

export const isEditorUserRole = (role: UserRole | VirtualRole): role is typeof EDITOR_USER_ROLES[number] => EDITOR_USER_ROLES.includes(role as any);

export const isAdminOrOwnerUserRole = (role: UserRole | VirtualRole): role is typeof OWNER_AND_ADMIN_ROLES[number] =>
  OWNER_AND_ADMIN_ROLES.includes(role as any);
