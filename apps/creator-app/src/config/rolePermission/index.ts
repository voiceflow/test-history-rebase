import { UserRole } from '@voiceflow/internal';

import { Permission } from '@/constants/permissions';
import {
  ADMIN_OWNER_BILLING_ROLES,
  ALL_USER_ROLES,
  EDITOR_AND_BILLING_USER_ROLES,
  EDITOR_USER_ROLES,
  OWNER_AND_ADMIN_ROLES,
  SIGNED_USER_ROLES,
  VirtualRole,
} from '@/constants/roles';

import { buildRolePermissionRecord } from './utils';

export * from './types';

export const ROLE_PERMISSIONS = buildRolePermissionRecord([
  // configurable

  // all
  { permission: Permission.VIEW_CONVERSATIONS, roles: ALL_USER_ROLES },
  { permission: Permission.SHARE_PROTOTYPE_PASSWORD, roles: ALL_USER_ROLES },

  // signed
  { permission: Permission.COMMENTING, roles: SIGNED_USER_ROLES },
  { permission: Permission.CANVAS_HINT_FEATURES, roles: SIGNED_USER_ROLES },
  { permission: Permission.CANVAS_REALTIME, roles: SIGNED_USER_ROLES },
  { permission: Permission.SHARE_PROTOTYPE, roles: SIGNED_USER_ROLES },
  { permission: Permission.VIEW_COLLABORATORS, roles: SIGNED_USER_ROLES },

  // editor
  { permission: Permission.DOMAIN_EDIT, roles: EDITOR_USER_ROLES },
  { permission: Permission.CANVAS_EDIT, roles: EDITOR_USER_ROLES },
  { permission: Permission.PROJECT_EDIT, roles: EDITOR_USER_ROLES },
  { permission: Permission.API_KEY_EDIT, roles: EDITOR_USER_ROLES },
  { permission: Permission.IMPORT_PROJECT, roles: EDITOR_USER_ROLES },
  { permission: Permission.CANVAS_PUBLISH, roles: EDITOR_USER_ROLES },
  { permission: Permission.IMPORT_PROJECT, roles: EDITOR_USER_ROLES },
  { permission: Permission.TRAIN_PROTOTYPE, roles: EDITOR_USER_ROLES },
  { permission: Permission.PROJECTS_MANAGE, roles: EDITOR_USER_ROLES },
  { permission: Permission.PROJECT_VERSIONS, roles: EDITOR_USER_ROLES },
  { permission: Permission.RENDER_PROTOTYPE, roles: EDITOR_USER_ROLES },
  { permission: Permission.NLU_VIEW_MANAGER, roles: EDITOR_USER_ROLES },
  { permission: Permission.DELETE_TRANSCRIPT, roles: EDITOR_USER_ROLES },
  { permission: Permission.CANVAS_OPEN_EDITOR, roles: EDITOR_USER_ROLES },
  { permission: Permission.NLU_UNCLASSIFIED_DELETE, roles: EDITOR_USER_ROLES },
  { permission: Permission.PROJECT_CONVERT_TO_DOMAIN, roles: EDITOR_USER_ROLES },
  { permission: Permission.REORDER_TOPICS_AND_COMPONENTS, roles: EDITOR_USER_ROLES },

  // editor and billing
  { permission: Permission.INVITE_BY_LINK, roles: EDITOR_AND_BILLING_USER_ROLES },
  { permission: Permission.ADD_COLLABORATORS, roles: EDITOR_AND_BILLING_USER_ROLES },
  { permission: Permission.UPGRADE_WORKSPACE, roles: EDITOR_AND_BILLING_USER_ROLES },
  { permission: Permission.PROJECT_LIST_MANAGE, roles: EDITOR_AND_BILLING_USER_ROLES },

  // admin, owner, and billing
  { permission: Permission.BILLING_SEATS_ADD, roles: ADMIN_OWNER_BILLING_ROLES },
  { permission: Permission.CONFIGURE_WORKSPACE, roles: ADMIN_OWNER_BILLING_ROLES },
  { permission: Permission.ADD_COLLABORATORS_V2, roles: ADMIN_OWNER_BILLING_ROLES },
  { permission: Permission.VIEW_SETTINGS_WORKSPACE, roles: ADMIN_OWNER_BILLING_ROLES },
  { permission: Permission.CONFIGURE_WORKSPACE_BILLING, roles: ADMIN_OWNER_BILLING_ROLES },

  // owner and admin
  { permission: Permission.INVITE, roles: OWNER_AND_ADMIN_ROLES },
  { permission: Permission.DELETE_WORKSPACE, roles: OWNER_AND_ADMIN_ROLES },
  { permission: Permission.ORGANIZATION_CONFIGURE_SSO, roles: OWNER_AND_ADMIN_ROLES },
  { permission: Permission.MANAGE_ADMIN_COLLABORATORS, roles: OWNER_AND_ADMIN_ROLES },
  { permission: Permission.CONFIGURE_WORKSPACE_DEVELOPER, roles: OWNER_AND_ADMIN_ROLES },

  // owner only
  { permission: Permission.UNABLE_TO_LEAVE_WORKSPACE, roles: [UserRole.OWNER, VirtualRole.ORGANIZATION_ADMIN] },
  { permission: Permission.ORGANIZATION_MANAGE_MEMBERS, roles: [UserRole.OWNER, VirtualRole.ORGANIZATION_ADMIN] },
  { permission: Permission.PRIVATE_CLOUD_WORKSPACE_CREATE, roles: [UserRole.OWNER, VirtualRole.ORGANIZATION_ADMIN] },
]);

export type RolePermissions = typeof ROLE_PERMISSIONS;
export type RolePermissionKey = keyof RolePermissions;
