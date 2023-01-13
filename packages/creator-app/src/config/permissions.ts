import { PlanType, UserRole } from '@voiceflow/internal';

/**
 * These roles are applied to contexts within the app that need to act as
 * someone other than the primary authenticated user
 */
export enum VirtualRole {
  GUEST = 'guest', // for "side-apps" like Prototype Share that do not require login
  PREVIEWER = 'previewer', // for previewing old versions
}

export enum Permission {
  // organization
  CONFIGURE_ORGANIZATION = 'organization.CONFIGURE',
  EDIT_ORGANIZATION = 'organization.EDIT',

  // workspace
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
  ADD_COLLABORATORS_V2 = 'collaborator.ADD_V2',
  VIEW_COLLABORATORS = 'collaborator.VIEW',
  MANAGE_ADMIN_COLLABORATORS = 'collaborator.MANAGE_ADMINS',

  // project
  MANAGE_PROJECTS = 'project.MANAGE',
  SHARE_PROJECT = 'project.SHARE',
  EDIT_PROJECT = 'project.EDIT',

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

  // project versions
  FULL_PROJECT_VERSIONS = 'versions.PROJECT_VERSIONS',

  // project list
  MANAGE_PROJECT_LISTS = 'project_list.MANAGE',

  // billing
  MANAGE_BILLING = 'billing.MANAGE',
  MANAGE_SEATS = 'billing.SEATS',

  // canvas
  EDIT_CANVAS = 'canvas.EDIT',
  CANVAS_REALTIME = 'canvas.REALTIME',
  CANVAS_MARKUP = 'canvas.MARKUP',
  CANVAS_EXPORT = 'canvas.EXPORT',
  CANVAS_PUBLISH = 'canvas.PUBLISH',
  HINT_FEATURES = 'canvas.HINT_FEATURES',
  OPEN_EDITOR = 'canvas.OPEN_EDITOR',

  // features
  COMMENTING = 'feature.COMMENTING',
  BULK_UPLOAD = 'feature.BULK_UPLOAD',

  // Transcript
  DELETE_TRANSCRIPT = 'transcripts.DELETE',
  VIEW_CONVERSATIONS = 'transcripts.VIEW',
  TRANSCRIPTS_ENABLED = 'transcripts.ENABLED',

  // private cloud
  CREATE_PRIVATE_CLOUD_WORKSPACE = 'private_cloud.workspace.CREATE',

  // T&C
  REORDER_TOPICS_AND_COMPONENTS = 'topics_components.REORDER',

  // NLU
  NLU_EXPORT_ALL = 'nlu.EXPORT_ALL',
  NLU_EXPORT_CSV = 'nlu.EXPORT_CSV',
  NLU_UNCLASSIFIED_DOWNLOAD = 'nlu.UNCLASSIFIED_DOWNLOAD',
  NLU_UNCLASSIFIED_DELETE = 'nlu.NLU_UNCLASSIFIED_DELETE',
  NLU_CUSTOM = 'nlu.CUSTOM_PROJECT',
  NLU_CONFLICTS = 'nlu.VIEW_CONFLICTS',

  // API keys
  API_KEY_EDIT = 'api_key.EDIT',
  API_KEY_VIEW = 'api_key.VIEW',
}

const ALL_USER_ROLES = [UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER, UserRole.OWNER, UserRole.BILLING, VirtualRole.GUEST];
const SIGNED_USER_ROLES = [UserRole.ADMIN, UserRole.EDITOR, UserRole.OWNER, UserRole.VIEWER, UserRole.BILLING];
const EDITOR_USER_ROLES = [UserRole.ADMIN, UserRole.EDITOR, UserRole.OWNER];
const EDITOR_AND_BILLING_USER_ROLES = [UserRole.ADMIN, UserRole.EDITOR, UserRole.OWNER, UserRole.BILLING];
const OWNER_AND_ADMIN_ROLES = [UserRole.OWNER, UserRole.ADMIN];
// To be used when dashboard V2 is released
// const ADMIN_AND_BILLING_ROLES = [UserRole.ADMIN, UserRole.BILLING];
const ADMIN_OWNER_BILLING_ROLES = [UserRole.ADMIN, UserRole.OWNER, UserRole.BILLING];

export const ROLE_PERMISSIONS: Partial<Record<Permission, Array<UserRole | VirtualRole>>> = {
  [Permission.CONFIGURE_ORGANIZATION]: OWNER_AND_ADMIN_ROLES,
  [Permission.EDIT_ORGANIZATION]: [UserRole.OWNER],

  [Permission.ADD_COLLABORATORS]: EDITOR_AND_BILLING_USER_ROLES,
  [Permission.ADD_COLLABORATORS_V2]: ADMIN_OWNER_BILLING_ROLES,
  [Permission.VIEW_COLLABORATORS]: SIGNED_USER_ROLES,
  [Permission.MANAGE_ADMIN_COLLABORATORS]: OWNER_AND_ADMIN_ROLES,
  [Permission.DELETE_TRANSCRIPT]: EDITOR_USER_ROLES,
  [Permission.INVITE_BY_LINK]: EDITOR_AND_BILLING_USER_ROLES,
  [Permission.INVITE]: OWNER_AND_ADMIN_ROLES,

  [Permission.CONFIGURE_WORKSPACE]: ADMIN_OWNER_BILLING_ROLES,
  [Permission.CONFIGURE_WORKSPACE_DEVELOPER]: OWNER_AND_ADMIN_ROLES,
  [Permission.CONFIGURE_WORKSPACE_BILLING]: ADMIN_OWNER_BILLING_ROLES,
  [Permission.VIEW_SETTINGS_WORKSPACE]: ADMIN_OWNER_BILLING_ROLES,
  [Permission.UPGRADE_WORKSPACE]: EDITOR_AND_BILLING_USER_ROLES,
  [Permission.DELETE_WORKSPACE]: OWNER_AND_ADMIN_ROLES,
  [Permission.UNABLE_TO_LEAVE_WORKSPACE]: [UserRole.OWNER],
  [Permission.IMPORT_PROJECT]: ALL_USER_ROLES,

  [Permission.MANAGE_PROJECTS]: EDITOR_USER_ROLES,
  [Permission.MANAGE_PROJECT_LISTS]: EDITOR_AND_BILLING_USER_ROLES,
  [Permission.EDIT_PROJECT]: EDITOR_USER_ROLES,

  [Permission.EDIT_CANVAS]: EDITOR_USER_ROLES,
  [Permission.OPEN_EDITOR]: EDITOR_USER_ROLES,
  [Permission.CANVAS_REALTIME]: SIGNED_USER_ROLES,
  [Permission.COMMENTING]: SIGNED_USER_ROLES,
  [Permission.SHARE_PROTOTYPE]: SIGNED_USER_ROLES,
  [Permission.SHARE_PROTOTYPE_PASSWORD]: ALL_USER_ROLES,
  [Permission.TRAIN_PROTOTYPE]: EDITOR_USER_ROLES,
  [Permission.RENDER_PROTOTYPE]: EDITOR_USER_ROLES,
  [Permission.CANVAS_PUBLISH]: EDITOR_USER_ROLES,
  [Permission.VIEW_CONVERSATIONS]: ALL_USER_ROLES,

  [Permission.HINT_FEATURES]: SIGNED_USER_ROLES,

  [Permission.CREATE_PRIVATE_CLOUD_WORKSPACE]: [UserRole.OWNER],

  [Permission.REORDER_TOPICS_AND_COMPONENTS]: EDITOR_USER_ROLES,

  [Permission.API_KEY_EDIT]: EDITOR_USER_ROLES,
  [Permission.API_KEY_VIEW]: EDITOR_USER_ROLES,

  [Permission.NLU_UNCLASSIFIED_DELETE]: EDITOR_USER_ROLES,
  [Permission.NLU_UNCLASSIFIED_DOWNLOAD]: ALL_USER_ROLES,
};

const ALL_PERMISSIONS = Object.values(PlanType);

const ALL_BUT_STARTER_PERMISSIONS = ALL_PERMISSIONS.filter((plan) => plan !== PlanType.STARTER && plan !== PlanType.OLD_STARTER);

const PTE_PERMISSIONS = [PlanType.PRO, PlanType.OLD_PRO, PlanType.TEAM, PlanType.OLD_TEAM, PlanType.ENTERPRISE, PlanType.OLD_ENTERPRISE];
const NON_ENTERPRISE_PERMISSIONS = [
  PlanType.OLD_STARTER,
  PlanType.OLD_PRO,
  PlanType.OLD_ENTERPRISE,
  PlanType.OLD_TEAM,
  PlanType.STARTER,
  PlanType.STUDENT,
  PlanType.PRO,
  PlanType.TEAM,
  PlanType.CREATOR,
];
const PT_PERMISSIONS = [PlanType.PRO, PlanType.OLD_PRO, PlanType.TEAM, PlanType.OLD_TEAM];

export const PLAN_PERMISSIONS: Partial<Record<Permission, PlanType[]>> = {
  [Permission.CANVAS_EXPORT]: [PlanType.STUDENT, PlanType.PRO, PlanType.OLD_PRO, PlanType.TEAM, PlanType.OLD_TEAM, PlanType.ENTERPRISE],
  [Permission.CANVAS_REALTIME]: ALL_PERMISSIONS,
  [Permission.COMMENTING]: ALL_PERMISSIONS,
  [Permission.BULK_UPLOAD]: [PlanType.STUDENT, PlanType.PRO, PlanType.OLD_PRO, PlanType.TEAM, PlanType.OLD_TEAM, PlanType.ENTERPRISE],
  [Permission.MODEL_EXPORT]: ALL_BUT_STARTER_PERMISSIONS,
  [Permission.MODAL_PDF_PNG_EXPORT]: PTE_PERMISSIONS,
  [Permission.SHARE_PROTOTYPE]: ALL_PERMISSIONS,
  [Permission.SHARE_PROTOTYPE_PASSWORD]: PTE_PERMISSIONS,
  [Permission.CUSTOMIZE_PROTOTYPE]: PTE_PERMISSIONS,
  [Permission.SHARE_PROJECT]: [
    PlanType.STUDENT,
    PlanType.OLD_STARTER,
    PlanType.STARTER,
    PlanType.PRO,
    PlanType.OLD_PRO,
    PlanType.TEAM,
    PlanType.OLD_TEAM,
    PlanType.ENTERPRISE,
    PlanType.OLD_ENTERPRISE,
    PlanType.CREATOR,
  ],
  [Permission.MANAGE_BILLING]: [
    PlanType.STARTER,
    PlanType.OLD_STARTER,
    PlanType.PRO,
    PlanType.OLD_PRO,
    PlanType.TEAM,
    PlanType.OLD_TEAM,
    PlanType.CREATOR,
  ],
  [Permission.MANAGE_SEATS]: PT_PERMISSIONS,
  [Permission.CODE_EXPORT]: [PlanType.ENTERPRISE, PlanType.OLD_ENTERPRISE],
  [Permission.CONFIGURE_ORGANIZATION]: [PlanType.ENTERPRISE],
  [Permission.FULL_PROJECT_VERSIONS]: ALL_BUT_STARTER_PERMISSIONS,
  [Permission.TRANSCRIPTS_ENABLED]: PTE_PERMISSIONS,
  [Permission.NLU_EXPORT_ALL]: [PlanType.ENTERPRISE, PlanType.OLD_ENTERPRISE],
  [Permission.NLU_EXPORT_CSV]: PTE_PERMISSIONS,
  [Permission.NLU_CUSTOM]: [PlanType.ENTERPRISE, PlanType.OLD_ENTERPRISE],
  [Permission.NLU_CONFLICTS]: [PlanType.ENTERPRISE, PlanType.OLD_ENTERPRISE],
  [Permission.ADD_COLLABORATORS_V2]: NON_ENTERPRISE_PERMISSIONS,
};

export const TRIAL_EXPIRED_NOT_ALLOWED_PERMISSIONS = [
  Permission.EDIT_CANVAS,
  Permission.EDIT_PROJECT,
  Permission.VIEW_CONVERSATIONS,
  Permission.COMMENTING,
  Permission.HINT_FEATURES,
  Permission.MANAGE_PROJECTS,
  Permission.SHARE_PROJECT,
  Permission.EDIT_PROJECT,
  Permission.CODE_EXPORT,
  Permission.MODEL_EXPORT,
  Permission.MANAGE_PROJECTS,
  Permission.ADD_COLLABORATORS,
];

export const hasOrganizationTrialPermission = (permission: Permission, trialExpired: boolean) =>
  !trialExpired || !TRIAL_EXPIRED_NOT_ALLOWED_PERMISSIONS.includes(permission);

export const hasRolePermission = (permission: Permission, role: UserRole | VirtualRole) =>
  !ROLE_PERMISSIONS[permission] || ROLE_PERMISSIONS[permission]!.includes(role);

export const hasPlanPermission = (permission: Permission, plan: PlanType) =>
  !PLAN_PERMISSIONS[permission] || PLAN_PERMISSIONS[permission]!.includes(plan);

export const hasPermission = (permission: Permission, role: UserRole | VirtualRole, plan: PlanType, orgTrialExpired?: boolean | null) => {
  const roleAllowed = hasRolePermission(permission, role);
  const planAllowed = hasPlanPermission(permission, plan);
  const trialAllowed = orgTrialExpired ? hasOrganizationTrialPermission(permission, orgTrialExpired) : true;

  return roleAllowed && planAllowed && trialAllowed;
};
