export const ROLE_PERMISSION_DEFAULT_WARN_MESSAGE = 'You do not have permission to this feature';

export const PLAN_PERMISSION_DEFAULT_WARN_MESSAGE = 'This feature is not available on your current plan';

export const TRIAL_EXPIRED_PERMISSION_DEFAULT_WARN_MESSAGE =
  'Your trial has expired. Please upgrade to continue using this feature.';

export enum Permission {
  // organization
  ORGANIZATION_CONFIGURE_SSO = 'organization:CONFIGURE_SSO',
  ORGANIZATION_MANAGE_MEMBERS = 'organization:MANAGE_MEMBERS',
  ORGANIZATION_UPDATE = 'organization:UPDATE',

  // workspace
  WORKSPACE_CREATE = 'workspace:CREATE',
  WORKSPACE_MANAGE = 'workspace:MANAGE',
  WORKSPACE_UPGRADE = 'workspace:UPGRADE',
  WORKSPACE_DELETE = 'workspace:DELETE',
  WORKSPACE_INVITE = 'workspace:INVITE',
  WORKSPACE_IMPORT_PROJECT = 'workspace:IMPORT_PROJECT',
  WORKSPACE_UNABLE_TO_LEAVE = 'workspace:UNABLE_TO_LEAVE',
  WORKSPACE_PROJECTS_MANAGE = 'workspace.projects:MANAGE',

  // billing
  WORKSPACE_BILLING_MANAGE = 'workspace.billing:MANAGE',
  WORKSPACE_BILLING_ADD_SEATS = 'workspace.billing:SEATS_ADD',

  // workspace members
  WORKSPACE_MEMBER_ADD = 'workspace.member:ADD',
  WORKSPACE_MEMBER_MANAGE_ADMIN = 'workspace.member:MANAGE_ADMIN',

  // project
  PROJECT_UPDATE = 'project:UPDATE',
  PROJECT_COMMENT = 'project:COMMENT',
  PROJECT_VERSIONS_READ = 'project.versions.READ',

  // project members
  PROJECT_MEMBER_READ = 'project.member:READ',

  // prototype
  PROJECT_PROTOTYPE_SHARE = 'project.prototype:SHARE',
  PROJECT_PROTOTYPE_RENDER = 'project.prototype:RENDER',
  PROJECT_PROTOTYPE_SHARE_PASSWORD = 'project.prototype:SHARE_PASSWORD',
  PROJECT_CANVAS_OPEN_EDITOR = 'project.canvas:OPEN_EDITOR',
  PROJECT_CANVAS_HINT_FEATURES = 'project.canvas:HINT_FEATURES',
  PROJECT_CANVAS_UPDATE = 'project.canvas:UPDATE',

  // Transcript
  PROJECT_TRANSCRIPT_DELETE = 'project.transcript:DELETE',
  PROJECT_TRANSCRIPT_READ = 'project.transcript:READ',

  // project list
  PROJECT_LIST_MANAGE = 'project_list.MANAGE',

  // private cloud
  PRIVATE_CLOUD_WORKSPACE_CREATE = 'private_cloud.workspace:CREATE',

  // API keys
  API_KEY_UPDATE = 'api_key.UPDATE',

  // features (when a permission is only plan based, it should be prefixed with FEATURE_)
  FEATURE_BULK_UPLOAD = 'feature:BULK_UPLOAD',
  FEATURE_NLU_CUSTOM = 'feature.nlu:CUSTOM_PROJECT',
  FEATURE_NLU_EXPORT_ALL = 'feature.nlu:EXPORT_ALL',
  FEATURE_NLU_EXPORT_CSV = 'feature.nlu:EXPORT_CSV',
  FEATURE_KB_REFRESH_RATE = 'feature.kb:REFRESH_RATE',
  FEATURE_AI_PLAYGROUND_DISCLAIMER = 'feature:AI_PLAYGROUND_DISCLAIMER',
  FEATURE_CANVAS_EXPORT = 'feature.canvas:EXPORT',
  FEATURE_CANVAS_PAID_STEPS = 'feature.canvas:PAID_STEPS',
  FEATURE_SHARE_PROJECT = 'feature:SHARE_PROJECT',
  FEATURE_EXPORT_CODE = 'feature:EXPORT_CODE',
  FEATURE_EXPORT_MODEL = 'feature:EXPORT_MODEL', // to be removed once revised permissions feature is implemented
  FEATURE_CUSTOMIZE_PROTOTYPE = 'feature:CUSTOMIZE_PROTOTYPE',
  FEATURE_FULL_BACKUP_HISTORY = 'feature:FULL_BACKUP_HISTORY',

  // kill once everyone is on chargebee? confirm with proudct, since some customers will have extra seats
  FEATURE_MANAGE_SEATS = 'feature:MANAGE_SEATS',
  FEATURE_ADVANCED_LLM_MODELS = 'feature:ADVANCED_LLM_MODELS', // kill once everyone is on chargebee
  FEATURE_SCHEDULE_SEATS = 'feature:SCHEDULE_SEATS', // kill once everyone is on chargebee
}
