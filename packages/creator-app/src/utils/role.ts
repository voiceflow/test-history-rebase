import { UserRole } from '@voiceflow/internal';

import { EDITOR_USER_ROLES, OWNER_AND_ADMIN_ROLES } from '@/constants/roles';

export const isEditorUserRole = (role: UserRole): role is typeof EDITOR_USER_ROLES[number] => EDITOR_USER_ROLES.includes(role as any);

export const isAdminOrOwnerUserRole = (role: UserRole): role is typeof OWNER_AND_ADMIN_ROLES[number] => OWNER_AND_ADMIN_ROLES.includes(role as any);
