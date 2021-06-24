export const PAGE_SIZE = 50;

export enum Option {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

export enum SessionType {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  BASIC_AUTH = 'session',
  SIGN_UP = 'user',
}

export enum PlanType {
  OLD_STARTER = 'old_starter',
  OLD_PRO = 'old_pro',
  OLD_ENTERPRISE = 'old_enterprise',
  OLD_TEAM = 'old_team',
  STARTER = 'starter',
  STUDENT = 'student',
  PRO = 'pro',
  TEAM = 'team',
  ENTERPRISE = 'enterprise',
  CREATOR = 'creator',
}

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
  LIBRARY = 'library',
  OWNER = 'owner',
  GUEST = 'guest', // use for "side-apps" like Prototype Share that do not require login
  BILLING = 'billing',
}
