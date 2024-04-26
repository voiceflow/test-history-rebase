export const ROLE_PERMISSION_DEFAULT_WARN_MESSAGE = 'You do not have permission to this feature';

export const PLAN_PERMISSION_DEFAULT_WARN_MESSAGE = 'This feature is not available on your current plan';

export const TRIAL_EXPIRED_PERMISSION_DEFAULT_WARN_MESSAGE =
  'Your trial has expired. Please upgrade to continue using this feature.';

// TODO: refactor keys, should be prefixed with the domain name, FE WORKSPACE_, PROJECT_, etc
export enum Permission {
  // organization
  ORGANIZATION_CONFIGURE_SSO = 'organization.CONFIGURE_SSO',
  ORGANIZATION_MANAGE_MEMBERS = 'organization.MANAGE_MEMBERS',
  EDIT_ORGANIZATION = 'organization.EDIT',

  // workspace
  WORKSPACE_CREATE = 'workspace.CREATE',
  CONFIGURE_WORKSPACE = 'workspace.CONFIGURE',
  CONFIGURE_WORKSPACE_DEVELOPER = 'workspace.CONFIGURE_DEVELOPER',
  CONFIGURE_WORKSPACE_BILLING = 'workspace.CONFIGURE_DEVELOPER',
  VIEW_SETTINGS_WORKSPACE = 'workspace.VIEW_SETTINGS',
  UPGRADE_WORKSPACE = 'workspace.UPGRADE',
  DELETE_WORKSPACE = 'workspace.DELETE',
  INVITE_BY_LINK = 'workspace.INVITE_BY_LINK',
  INVITE = 'workspace.INVITE',
  IMPORT_PROJECT = 'workspace.IMPORT_PROJECT',
  UNABLE_TO_LEAVE_WORKSPACE = 'workspace.UNABLE_TO_LEAVE',

  // collaborator
  ADD_COLLABORATORS = 'collaborator.ADD',
  VIEW_COLLABORATORS = 'collaborator.VIEW',
  MANAGE_ADMIN_COLLABORATORS = 'collaborator.MANAGE_ADMINS',

  // project
  PROJECT_EDIT = 'project.EDIT',
  PROJECT_SHARE = 'project.SHARE',
  PROJECT_VERSIONS = 'project.VERSIONS',
  PROJECT_FULL_VERSIONS = 'project.FULL_VERSIONS',
  PROJECT_CONVERT_TO_DOMAIN = 'project.CONVERT_DO_DOMAIN',

  // projects
  PROJECTS_MANAGE = 'projects.MANAGE',

  // export
  CODE_EXPORT = 'export.CODE',
  MODEL_EXPORT = 'export.MODEL', // to be removed once revised permissions feature is implemented
  MODAL_PDF_PNG_EXPORT = 'export.MODAL_ALL',

  // prototype
  SHARE_PROTOTYPE = 'prototype.SHARE',
  TRAIN_PROTOTYPE = 'prototype.TRAIN',
  RENDER_PROTOTYPE = 'prototype.RENDER',
  CUSTOMIZE_PROTOTYPE = 'prototype.CUSTOMIZE',
  SHARE_PROTOTYPE_PASSWORD = 'prototype.SHARE_PASSWORD',

  // project list
  PROJECT_LIST_MANAGE = 'project_list.MANAGE',

  // billing
  BILLING_SEATS_SCHEDULE = 'billing.SEATS_SCHEDULE',
  BILLING_SEATS_ADD = 'billing.SEATS_ADD',
  BILLING_SEATS = 'billing.SEATS',
  BILLING_MANAGE = 'billing.MANAGE',

  // domain
  DOMAIN_EDIT = 'domain.EDIT',

  // canvas
  CANVAS_EDIT = 'canvas.EDIT',
  CANVAS_MARKUP = 'canvas.MARKUP',
  CANVAS_EXPORT = 'canvas.EXPORT',
  CANVAS_PUBLISH = 'canvas.PUBLISH',
  CANVAS_REALTIME = 'canvas.REALTIME',
  CANVAS_PAID_STEPS = 'canvas.PAID_STEPS',
  CANVAS_OPEN_EDITOR = 'canvas.OPEN_EDITOR',
  CANVAS_HINT_FEATURES = 'canvas.HINT_FEATURES',

  // features
  COMMENTING = 'feature.COMMENTING',
  BULK_UPLOAD = 'feature.BULK_UPLOAD',

  // Transcript
  DELETE_TRANSCRIPT = 'transcripts.DELETE',
  VIEW_CONVERSATIONS = 'transcripts.VIEW',

  // private cloud
  PRIVATE_CLOUD_WORKSPACE_CREATE = 'private_cloud.workspace.CREATE',

  // T&C
  REORDER_TOPICS_AND_COMPONENTS = 'topics_components.REORDER',

  // NLU
  NLU_CUSTOM = 'nlu.CUSTOM_PROJECT',
  NLU_EXPORT_ALL = 'nlu.EXPORT_ALL',
  NLU_EXPORT_CSV = 'nlu.EXPORT_CSV',

  // KB
  KB_REFRESH_RATE = 'kb.REFRESH_RATE',

  // API keys
  API_KEY_EDIT = 'api_key.EDIT',

  // AI
  AI_PLAYGROUND_DISCLAIMER = 'ai_playground.EDIT',

  ADVANCED_LLM_MODELS = 'advanced_llm_models.EDIT',
}
