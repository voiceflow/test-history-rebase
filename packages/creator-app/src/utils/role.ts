import { UserRole } from '@voiceflow/internal';

import { EDITOR_USER_ROLES } from '@/constants/roles';

export const isEditorUserRole = (role: UserRole): role is typeof EDITOR_USER_ROLES[number] => EDITOR_USER_ROLES.includes(role as any);
