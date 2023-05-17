import { Nullish } from '@voiceflow/common';
import { UserRole } from '@voiceflow/internal';
import { ArrayItem } from '@voiceflow/realtime-sdk';

import { ADMIN_ROLES, ALL_VIRTUAL_ROLES, EDITOR_USER_ROLES, VIEWER_USER_ROLES, VirtualRole } from '@/constants/roles';

export const isVirtualRole = (role: Nullish<UserRole | VirtualRole>): role is VirtualRole => ALL_VIRTUAL_ROLES.includes(role as any);

export const isEditorUserRole = (role: Nullish<UserRole | VirtualRole>): role is ArrayItem<typeof EDITOR_USER_ROLES> =>
  EDITOR_USER_ROLES.includes(role as any);

export const isAdminUserRole = (role: Nullish<UserRole | VirtualRole>): role is ArrayItem<typeof ADMIN_ROLES> => ADMIN_ROLES.includes(role as any);

export const isViewerUserRole = (role: UserRole): role is ArrayItem<typeof VIEWER_USER_ROLES> => VIEWER_USER_ROLES.includes(role);
