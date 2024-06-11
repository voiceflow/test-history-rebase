import { UserRole } from '@voiceflow/dtos';

/**
 * These roles are applied to contexts within the app that need to act as
 * someone other than the primary authenticated user
 */
export enum VirtualRole {
  /**
   * for "side-apps" like Prototype Share that do not require login
   */
  GUEST = 'guest',

  /**
   * for previewing old versions
   */
  PREVIEWER = 'previewer',

  /**
   * for organization settings page
   */
  ORGANIZATION_ADMIN = 'organization_admin',

  /**
   * locked project viewer
   */
  LOCKED_PROJECT_VIEWER = 'locked_project_viewer',
}

export const VIRTUAL_ROLE_STRENGTH: Record<VirtualRole, number> = {
  [VirtualRole.GUEST]: 0,
  [VirtualRole.PREVIEWER]: 1000,
  [VirtualRole.ORGANIZATION_ADMIN]: 100,
  [VirtualRole.LOCKED_PROJECT_VIEWER]: 500,
};

export const ALL_VIRTUAL_ROLES = Object.values(VirtualRole);

export const VIEWER_PLUS_USER_ROLES = [
  UserRole.ADMIN,
  UserRole.EDITOR,
  UserRole.VIEWER,
  UserRole.BILLING,
  VirtualRole.GUEST,
  VirtualRole.ORGANIZATION_ADMIN,
] satisfies Array<UserRole | VirtualRole>;

export const EDITOR_USER_ROLES = [UserRole.ADMIN, UserRole.EDITOR, VirtualRole.ORGANIZATION_ADMIN] satisfies Array<
  UserRole | VirtualRole
>;

export const SIGNED_USER_ROLES = [
  UserRole.ADMIN,
  UserRole.EDITOR,
  UserRole.VIEWER,
  UserRole.BILLING,
  VirtualRole.ORGANIZATION_ADMIN,
] satisfies Array<UserRole | VirtualRole>;

export const ADMIN_ROLES = [UserRole.ADMIN] satisfies Array<UserRole | VirtualRole>;

export const ADMIN_AND_BILLING_ROLES = [
  UserRole.ADMIN,
  UserRole.BILLING,
  VirtualRole.ORGANIZATION_ADMIN,
] satisfies Array<UserRole | VirtualRole>;

export const VIEWER_USER_ROLES = [UserRole.VIEWER, UserRole.BILLING];

export const EDITOR_AND_BILLING_USER_ROLES = [...EDITOR_USER_ROLES, UserRole.BILLING] satisfies Array<
  UserRole | VirtualRole
>;
