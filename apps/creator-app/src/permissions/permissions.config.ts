import { RoleScopeType } from '@voiceflow/schema-types';

import { Permission } from './permissions.constant';
import { BaseRolePermission } from './permissions.types';
import {
  ADMIN_AND_BILLING_ROLES,
  ADMIN_ROLES,
  EDITOR_AND_BILLING_USER_ROLES,
  EDITOR_USER_ROLES,
  SIGNED_USER_ROLES,
  VIEWER_PLUS_USER_ROLES,
} from './roles.constants';

export const PERMISSIONS_CONFIG: BaseRolePermission[] = [
  // configurable

  // all
  { permission: Permission.PROJECT_PROTOTYPE_PASSWORD, roles: VIEWER_PLUS_USER_ROLES },

  // signed
  { permission: Permission.FEATURE_COMMENTING, roles: SIGNED_USER_ROLES },
  { permission: Permission.CANVAS_HINT_FEATURES, roles: SIGNED_USER_ROLES },
  { permission: Permission.PROJECT_PROTOTYPE_SHARE, roles: SIGNED_USER_ROLES },
  { permission: Permission.MEMBER_VIEW, roles: SIGNED_USER_ROLES },
  { permission: Permission.PROJECT_VIEW_TRANSCRIPT, roles: SIGNED_USER_ROLES },

  // editor
  { permission: Permission.CANVAS_EDIT, roles: EDITOR_USER_ROLES },
  { permission: Permission.PROJECT_UPDATE, roles: EDITOR_USER_ROLES },
  { permission: Permission.API_KEY_EDIT, roles: EDITOR_USER_ROLES },
  { permission: Permission.WORKSPACE_IMPORT_PROJECT, roles: EDITOR_USER_ROLES },
  { permission: Permission.WORKSPACE_IMPORT_PROJECT, roles: EDITOR_USER_ROLES },
  {
    permission: Permission.WORKSPACE_MANAGE_PROJECTS,
    roles: EDITOR_USER_ROLES,
    scopes: [RoleScopeType.ORGANIZATION, RoleScopeType.WORKSPACE],
  },
  { permission: Permission.PROJECT_VERSIONS, roles: EDITOR_USER_ROLES },
  { permission: Permission.PROJECT_PROTOTYPE_RENDER, roles: EDITOR_USER_ROLES },
  { permission: Permission.PROJECT_DELETE_TRANSCRIPT, roles: EDITOR_USER_ROLES },
  { permission: Permission.CANVAS_OPEN_EDITOR, roles: EDITOR_USER_ROLES },

  // editor and billing
  { permission: Permission.WORKSPACE_MANAGE_PROJECT_LIST, roles: EDITOR_AND_BILLING_USER_ROLES },

  // admin, owner, and billing
  { permission: Permission.BILLING_SEATS_ADD, roles: ADMIN_AND_BILLING_ROLES },
  { permission: Permission.WORKSPACE_CONFIGURE, roles: ADMIN_AND_BILLING_ROLES },
  {
    permission: Permission.MEMBER_ADD,
    roles: ADMIN_AND_BILLING_ROLES,
    scopes: [RoleScopeType.ORGANIZATION, RoleScopeType.WORKSPACE],
  },
  { permission: Permission.WORKSPACE_CONFIGURE_BILLING, roles: ADMIN_AND_BILLING_ROLES },

  // owner and admin
  { permission: Permission.WORKSPACE_INVITE, roles: ADMIN_ROLES },
  { permission: Permission.WORKSPACE_DELETE, roles: ADMIN_ROLES },
  { permission: Permission.ORGANIZATION_CONFIGURE_SSO, roles: ADMIN_ROLES },
  { permission: Permission.MEMBER_MANAGE_ADMINS, roles: ADMIN_ROLES },

  // organization admin only
  { permission: Permission.WORKSPACE_UNABLE_TO_LEAVE, roles: ADMIN_ROLES, scopes: [RoleScopeType.ORGANIZATION] },
  { permission: Permission.ORGANIZATION_MEMBER_MANAGE, roles: ADMIN_ROLES, scopes: [RoleScopeType.ORGANIZATION] },
  { permission: Permission.WORKSPACE_CREATE, roles: ADMIN_ROLES, scopes: [RoleScopeType.ORGANIZATION] },
];
