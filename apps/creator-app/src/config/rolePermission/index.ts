import { Permission } from '@/constants/permissions';
import {
  ADMIN_AND_BILLING_ROLES,
  ADMIN_ROLES,
  EDITOR_AND_BILLING_USER_ROLES,
  EDITOR_USER_ROLES,
  SIGNED_USER_ROLES,
  VIEWER_PLUS_USER_ROLES,
  VirtualRole,
} from '@/constants/roles';

import { buildRolePermissionRecord } from './utils';

export * from './types';

export const ROLE_PERMISSIONS = buildRolePermissionRecord([
  // configurable

  // all
  { permission: Permission.PROJECT_PROTOTYPE_SHARE_PASSWORD, roles: VIEWER_PLUS_USER_ROLES },

  // signed
  { permission: Permission.PROJECT_COMMENT, roles: SIGNED_USER_ROLES },
  { permission: Permission.PROJECT_CANVAS_HINT_FEATURES, roles: SIGNED_USER_ROLES },
  { permission: Permission.PROJECT_PROTOTYPE_SHARE, roles: SIGNED_USER_ROLES },
  { permission: Permission.PROJECT_MEMBER_READ, roles: SIGNED_USER_ROLES },
  { permission: Permission.PROJECT_TRANSCRIPT_READ, roles: SIGNED_USER_ROLES },

  // editor
  { permission: Permission.PROJECT_CANVAS_UPDATE, roles: EDITOR_USER_ROLES },
  { permission: Permission.PROJECT_UPDATE, roles: EDITOR_USER_ROLES },
  { permission: Permission.API_KEY_UPDATE, roles: EDITOR_USER_ROLES },
  { permission: Permission.WORKSPACE_IMPORT_PROJECT, roles: EDITOR_USER_ROLES },
  { permission: Permission.WORKSPACE_IMPORT_PROJECT, roles: EDITOR_USER_ROLES },
  { permission: Permission.WORKSPACE_PROJECTS_MANAGE, roles: EDITOR_USER_ROLES, ignoreProjectIdentity: true },
  { permission: Permission.PROJECT_VERSIONS_READ, roles: EDITOR_USER_ROLES },
  { permission: Permission.PROJECT_PROTOTYPE_RENDER, roles: EDITOR_USER_ROLES },
  { permission: Permission.PROJECT_TRANSCRIPT_DELETE, roles: EDITOR_USER_ROLES },
  { permission: Permission.PROJECT_CANVAS_OPEN_EDITOR, roles: EDITOR_USER_ROLES },

  // editor and billing
  { permission: Permission.WORKSPACE_UPGRADE, roles: EDITOR_AND_BILLING_USER_ROLES },
  { permission: Permission.PROJECT_LIST_MANAGE, roles: EDITOR_AND_BILLING_USER_ROLES },

  // admin, owner, and billing
  { permission: Permission.WORKSPACE_BILLING_ADD_SEATS, roles: ADMIN_AND_BILLING_ROLES },
  { permission: Permission.WORKSPACE_MANAGE, roles: ADMIN_AND_BILLING_ROLES },
  { permission: Permission.WORKSPACE_MEMBER_ADD, roles: ADMIN_AND_BILLING_ROLES, ignoreProjectIdentity: true },
  { permission: Permission.WORKSPACE_BILLING_MANAGE, roles: ADMIN_AND_BILLING_ROLES },

  // owner and admin
  { permission: Permission.WORKSPACE_INVITE, roles: ADMIN_ROLES },
  { permission: Permission.WORKSPACE_DELETE, roles: ADMIN_ROLES },
  { permission: Permission.ORGANIZATION_CONFIGURE_SSO, roles: ADMIN_ROLES },
  { permission: Permission.WORKSPACE_MEMBER_MANAGE_ADMIN, roles: ADMIN_ROLES },

  // organization admin only
  { permission: Permission.WORKSPACE_UNABLE_TO_LEAVE, roles: [VirtualRole.ORGANIZATION_ADMIN] },
  { permission: Permission.ORGANIZATION_MANAGE_MEMBERS, roles: [VirtualRole.ORGANIZATION_ADMIN] },
  { permission: Permission.PRIVATE_CLOUD_WORKSPACE_CREATE, roles: [VirtualRole.ORGANIZATION_ADMIN] },
]);

export type RolePermissions = typeof ROLE_PERMISSIONS;
export type RolePermissionKey = keyof RolePermissions;
