import { PlanType, UserRole } from '@voiceflow/internal';

export enum Permission {
  // workspace
  CONFIGURE_WORKSPACE = 'workspace.CONFIGURE',
  UPGRADE_WORKSPACE = 'workspace.UPGRADE',
  INVITE_BY_LINK = 'workspace.INVITE_BY_LINK',
  IMPORT_PROJECT = 'workspace.IMPORT_PROJECT',

  // collaborator
  ADD_COLLABORATORS = 'collaborator.ADD',
  VIEW_COLLABORATORS = 'collaborator.VIEW',
  MANAGE_ADMIN_COLLABORATORS = 'collaborator.MANAGE_ADMINS',

  // project
  MANAGE_PROJECTS = 'project.MANAGE',
  CLONE_PROJECT = 'project.CLONE',
  SHARE_PROJECT = 'project.SHARE',
  EDIT_PROJECT = 'project.EDIT',

  // export
  CODE_EXPORT = 'export.CODE',
  MODEL_EXPORT = 'export.MODEL',

  // prototype
  SHARE_PROTOTYPE = 'prototype.SHARE',
  TRAIN_PROTOTYPE = 'prototype.TRAIN',
  RENDER_PROTOTYPE = 'prototype.RENDER',
  CUSTOMIZE_PROTOTYPE = 'prototype.CUSTOMIZE',
  SHARE_PROTOTYPE_PASSWORD = 'prototype.SHARE_PASSWORD',

  // project list
  MANAGE_PROJECT_LISTS = 'project_list.MANAGE',

  // billing
  MANAGE_BILLING = 'billing.MANAGE',

  // canvas
  EDIT_CANVAS = 'canvas.EDIT',
  CANVAS_REALTIME = 'canvas.REALTIME',
  CANVAS_MARKUP = 'canvas.MARKUP',
  CANVAS_EXPORT = 'canvas.EXPORT',
  CANVAS_PUBLISH = 'canvas.PUBLISH',
  HINT_FEATURES = 'canvas.HINT_FEATURES',

  // features
  COMMENTING = 'feature.COMMENTING',
  BULK_UPLOAD = 'feature.BULK_UPLOAD',

  // Transcript
  DELETE_TRANSCRIPT = 'transcripts.DELETE',
  VIEW_CONVERSATIONS = 'transcripts.VIEW',

  // private cloud
  CREATE_PRIVATE_CLOUD_WORKSPACE = 'private_cloud.workspace.CREATE',
}

const ALL_USER_ROLES = [UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER, UserRole.OWNER, UserRole.BILLING, UserRole.GUEST];
const SIGNED_USER_ROLES = [UserRole.ADMIN, UserRole.EDITOR, UserRole.OWNER, UserRole.VIEWER, UserRole.BILLING];
const EDITOR_USER_ROLES = [UserRole.ADMIN, UserRole.EDITOR, UserRole.OWNER];
const EDITOR_AND_BILLING_USER_ROLES = [UserRole.ADMIN, UserRole.EDITOR, UserRole.OWNER, UserRole.BILLING];

export const ROLE_PERMISSIONS: Partial<Record<Permission, UserRole[]>> = {
  [Permission.ADD_COLLABORATORS]: EDITOR_AND_BILLING_USER_ROLES,
  [Permission.VIEW_COLLABORATORS]: SIGNED_USER_ROLES,
  [Permission.MANAGE_ADMIN_COLLABORATORS]: [UserRole.ADMIN],
  [Permission.DELETE_TRANSCRIPT]: EDITOR_USER_ROLES,
  [Permission.INVITE_BY_LINK]: EDITOR_AND_BILLING_USER_ROLES,

  [Permission.CONFIGURE_WORKSPACE]: [UserRole.ADMIN],
  [Permission.UPGRADE_WORKSPACE]: EDITOR_AND_BILLING_USER_ROLES,
  [Permission.IMPORT_PROJECT]: ALL_USER_ROLES,

  [Permission.MANAGE_PROJECTS]: EDITOR_USER_ROLES,
  [Permission.MANAGE_PROJECT_LISTS]: EDITOR_AND_BILLING_USER_ROLES,
  [Permission.CLONE_PROJECT]: [UserRole.LIBRARY],
  [Permission.EDIT_PROJECT]: EDITOR_USER_ROLES,

  [Permission.EDIT_CANVAS]: EDITOR_USER_ROLES,
  [Permission.CANVAS_REALTIME]: SIGNED_USER_ROLES,
  [Permission.COMMENTING]: SIGNED_USER_ROLES,
  [Permission.SHARE_PROTOTYPE]: EDITOR_USER_ROLES,
  [Permission.SHARE_PROTOTYPE_PASSWORD]: ALL_USER_ROLES,
  [Permission.TRAIN_PROTOTYPE]: EDITOR_USER_ROLES,
  [Permission.RENDER_PROTOTYPE]: EDITOR_USER_ROLES,
  [Permission.CANVAS_PUBLISH]: EDITOR_USER_ROLES,
  [Permission.VIEW_CONVERSATIONS]: ALL_USER_ROLES,

  [Permission.HINT_FEATURES]: SIGNED_USER_ROLES,

  [Permission.CREATE_PRIVATE_CLOUD_WORKSPACE]: [UserRole.OWNER],
};

const ALL_PERMISSIONS = Object.values(PlanType);

const ALL_BUT_STARTER_PERMISSIONS = ALL_PERMISSIONS.filter((plan) => plan !== PlanType.STARTER && plan !== PlanType.OLD_STARTER);

const PTE_PERMISSIONS = [PlanType.PRO, PlanType.OLD_PRO, PlanType.TEAM, PlanType.OLD_TEAM, PlanType.ENTERPRISE, PlanType.OLD_ENTERPRISE];

export const PLAN_PERMISSIONS: Partial<Record<Permission, PlanType[]>> = {
  [Permission.CANVAS_EXPORT]: [PlanType.STUDENT, PlanType.PRO, PlanType.OLD_PRO, PlanType.TEAM, PlanType.OLD_TEAM, PlanType.ENTERPRISE],
  [Permission.COMMENTING]: [PlanType.STUDENT, PlanType.PRO, PlanType.OLD_PRO, PlanType.OLD_TEAM, PlanType.ENTERPRISE],
  [Permission.BULK_UPLOAD]: [PlanType.STUDENT, PlanType.PRO, PlanType.OLD_PRO, PlanType.TEAM, PlanType.OLD_TEAM, PlanType.ENTERPRISE],
  [Permission.MODEL_EXPORT]: ALL_BUT_STARTER_PERMISSIONS,
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
  [Permission.CODE_EXPORT]: [PlanType.ENTERPRISE, PlanType.OLD_ENTERPRISE],
};

export const hasRolePermission = (permission: Permission, role: UserRole) =>
  !ROLE_PERMISSIONS[permission] || ROLE_PERMISSIONS[permission]!.includes(role);

export const hasPlanPermission = (permission: Permission, plan: PlanType) =>
  !PLAN_PERMISSIONS[permission] || PLAN_PERMISSIONS[permission]!.includes(plan);

export const hasPermission = (permission: Permission, role: UserRole, plan: PlanType) => {
  const roleAllowed = hasRolePermission(permission, role);
  const planAllowed = hasPlanPermission(permission, plan);

  return roleAllowed && planAllowed;
};
