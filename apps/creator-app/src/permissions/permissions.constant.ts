export const ROLE_PERMISSION_DEFAULT_WARN_MESSAGE = 'You do not have permission to this feature';

export const PLAN_PERMISSION_DEFAULT_WARN_MESSAGE = 'This feature is not available on your current plan';

export const TRIAL_EXPIRED_PERMISSION_DEFAULT_WARN_MESSAGE =
  'Your trial has expired. Please upgrade to continue using this feature.';

export enum Permission {
  // organization
  ORGANIZATION_CONFIGURE_SSO = 'organization:CONFIGURE_SSO',
  ORGANIZATION_MEMBER_MANAGE = 'organization.member.MANAGE',
  ORGANIZATION_UPDATE = 'organization.UPDATE',

  // project member
  ORGANIZATION_MEMBER_CREATE = 'organization.member.CREATE',
  ORGANIZATION_MEMBER_UPDATE = 'organization.member.UPDATE',
  ORGANIZATION_MEMBER_DELETE = 'organization.member.DELETE',

  // workspace
  WORKSPACE_CREATE = 'workspace:CREATE',
  WORKSPACE_CONFIGURE = 'workspace:CONFIGURE',
  WORKSPACE_CONFIGURE_BILLING = 'workspace:CONFIGURE_BILLING',
  WORKSPACE_DELETE = 'workspace:DELETE',
  WORKSPACE_INVITE = 'workspace:INVITE',
  WORKSPACE_IMPORT_PROJECT = 'workspace:IMPORT_PROJECT',
  WORKSPACE_UNABLE_TO_LEAVE = 'workspace:UNABLE_TO_LEAVE',
  WORKSPACE_MANAGE_PROJECTS = 'workspace:MANAGE_PROJECTS',
  WORKSPACE_MANAGE_PROJECT_LIST = 'workspace:project_list:MANAGE',

  // workspace member
  WORKSPACE_MEMBER_CREATE = 'workspace.member:CREATE',
  WORKSPACE_MEMBER_UPDATE = 'workspace.member:UPDATE',
  WORKSPACE_MEMBER_DELETE = 'workspace.member:DELETE',
  WORKSPACE_MEMBER_READ = 'workspace.member:READ',

  // members
  MEMBER_ADD = 'member:ADD',
  MEMBER_VIEW = 'member:VIEW',
  MEMBER_MANAGE_ADMINS = 'member:MANAGE_ADMINS',

  // project
  PROJECT_UPDATE = 'project:EDIT',
  PROJECT_SHARE = 'project:SHARE',
  PROJECT_VERSIONS = 'project:VERSIONS',
  PROJECT_FULL_VERSIONS = 'project:FULL_VERSIONS',

  // project prototype
  PROJECT_PROTOTYPE_SHARE = 'project.prototype:SHARE',
  PROJECT_PROTOTYPE_RENDER = 'project.prototype:RENDER',
  PROJECT_PROTOTYPE_PROTOTYPE = 'project.prototype:CUSTOMIZE',
  PROJECT_PROTOTYPE_PASSWORD = 'project.prototype:PASSWORD',

  // project transcript
  PROJECT_DELETE_TRANSCRIPT = 'project.transcript:DELETE',
  PROJECT_VIEW_TRANSCRIPT = 'project.transcript:VIEW',

  // project member
  PROJECT_MEMBER_CREATE = 'project.member:CREATE',
  PROJECT_MEMBER_UPDATE = 'project.member:UPDATE',
  PROJECT_MEMBER_DELETE = 'project.member:DELETE',
  PROJECT_MEMBER_READ = 'project.member:READ',

  // export
  CODE_EXPORT = 'export:CODE',
  MODEL_EXPORT = 'export:MODEL', // to be removed once revised permissions feature is implemented

  // billing
  BILLING_SEATS_SCHEDULE = 'billing:SEATS_SCHEDULE',
  BILLING_SEATS_ADD = 'billing:SEATS_ADD',
  BILLING_SEATS = 'billing:SEATS',

  // canvas
  CANVAS_EDIT = 'canvas:EDIT',
  CANVAS_EXPORT = 'canvas:EXPORT',
  CANVAS_PAID_STEPS = 'canvas:PAID_STEPS',
  CANVAS_OPEN_EDITOR = 'canvas:OPEN_EDITOR',
  CANVAS_HINT_FEATURES = 'canvas:HINT_FEATURES',

  // features
  FEATURE_COMMENTING = 'feature:COMMENTING',
  FEATURE_BULK_UPLOAD = 'feature:BULK_UPLOAD',
  FEATURE_NLU_CUSTOM = 'feature:NLU_CUSTOM_PROJECT',
  FEATURE_NLU_EXPORT_ALL = 'feature:NLU_EXPORT_ALL',
  FEATURE_NLU_EXPORT_CSV = 'feature:NLU_EXPORT_CSV',
  FEATURE_KB_REFRESH_RATE = 'feature:KB_REFRESH_RATE',
  FEATURE_AI_PLAYGROUND = 'feature:AI_PLAYGROUND',
  FEATURE_ADVANCED_LLM_MODELS = 'feature.ADVANCED_LLM_MODELS',

  // API keys
  API_KEY_EDIT = 'api_key.EDIT',
}
