import { UserRole } from '@voiceflow/internal';

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
   * locked project viewer
   */
  LOCKED_PROJECT_VIEWER = 'locked_project_viewer',

  /**
   * for organization settings page
   */
  ORGANIZATION_ADMIN = 'organization_admin',
}

export const ALL_VIRTUAL_ROLES = Object.values(VirtualRole);

export const ALL_USER_ROLES = [UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER, UserRole.OWNER, UserRole.BILLING, VirtualRole.GUEST] satisfies Array<
  UserRole | VirtualRole
>;

export const EDITOR_USER_ROLES = [UserRole.ADMIN, UserRole.EDITOR, UserRole.OWNER] satisfies UserRole[];

export const SIGNED_USER_ROLES = [UserRole.ADMIN, UserRole.EDITOR, UserRole.OWNER, UserRole.VIEWER, UserRole.BILLING] satisfies UserRole[];

export const OWNER_AND_ADMIN_ROLES = [UserRole.OWNER, UserRole.ADMIN] satisfies UserRole[];

export const EDITOR_AND_BILLING_USER_ROLES = [...EDITOR_USER_ROLES, UserRole.BILLING] satisfies UserRole[];

// To be used when dashboard V2 is released
// export const ADMIN_AND_BILLING_ROLES = [UserRole.ADMIN, UserRole.BILLING] satisfies UserRole[];
export const ADMIN_OWNER_BILLING_ROLES = [UserRole.ADMIN, UserRole.OWNER, UserRole.BILLING] satisfies UserRole[];
