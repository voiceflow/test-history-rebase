import { PlanType, UserRole } from '@/constants';

export enum Permission {
  // workspace
  CONFIGURE_WORKSPACE = 'workspace.CONFIGURE',
  UPGRADE_WORKSPACE = 'workspace.UPGRADE',
  INVITE_BY_LINK = 'workspace.INVITE_BY_LINK',

  // collaborator
  ADD_COLLABORATORS = 'collaborator.ADD',
  VIEW_COLLABORATORS = 'collaborator.VIEW',

  // project
  MANAGE_PROJECTS = 'project.MANAGE',
  CLONE_PROJECT = 'project.CLONE',
  SHARE_PROJECT = 'project.SHARE',

  // prototype
  SHARE_PROTOTYPE = 'prototype.SHARE',

  // project list
  MANAGE_PROJECT_LISTS = 'project_list.MANAGE',

  // billing
  MANAGE_BILLING = 'billing.MANAGE',

  // canvas
  EDIT_CANVAS = 'canvas.EDIT',
  CANVAS_REALTIME = 'canvas.REALTIME',
  CANVAS_MARKUP = 'canvas.MARKUP',
  CANVAS_EXPORT = 'canvas.EXPORT',
  HINT_FEATURES = 'canvas.HINT_FEATURES',

  // features
  COMMENTING = 'feature.COMMENTING',
  BULK_UPLOAD = 'feature.BULK_UPLOAD',
}

export const ROLE_PERMISSIONS: Partial<Record<Permission, UserRole[]>> = {
  [Permission.ADD_COLLABORATORS]: [UserRole.ADMIN, UserRole.EDITOR],
  [Permission.VIEW_COLLABORATORS]: [UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER],

  [Permission.INVITE_BY_LINK]: [UserRole.ADMIN, UserRole.EDITOR],

  [Permission.CONFIGURE_WORKSPACE]: [UserRole.ADMIN],
  [Permission.UPGRADE_WORKSPACE]: [UserRole.ADMIN, UserRole.EDITOR],

  [Permission.MANAGE_PROJECTS]: [UserRole.ADMIN, UserRole.EDITOR],
  [Permission.MANAGE_PROJECT_LISTS]: [UserRole.ADMIN, UserRole.EDITOR],
  [Permission.CLONE_PROJECT]: [UserRole.LIBRARY],

  [Permission.EDIT_CANVAS]: [UserRole.ADMIN, UserRole.EDITOR],
  [Permission.CANVAS_MARKUP]: [UserRole.ADMIN, UserRole.EDITOR],
  [Permission.CANVAS_REALTIME]: [UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER],
  [Permission.COMMENTING]: [UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER],

  [Permission.HINT_FEATURES]: [UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER],
};

export const PLAN_PERMISSIONS: Partial<Record<Permission, PlanType[]>> = {
  [Permission.CANVAS_MARKUP]: [PlanType.STUDENT, PlanType.PRO, PlanType.OLD_PRO, PlanType.TEAM, PlanType.OLD_TEAM, PlanType.ENTERPRISE],
  [Permission.CANVAS_EXPORT]: [PlanType.STUDENT, PlanType.PRO, PlanType.OLD_PRO, PlanType.TEAM, PlanType.OLD_TEAM, PlanType.ENTERPRISE],
  [Permission.COMMENTING]: [PlanType.STUDENT, PlanType.PRO, PlanType.OLD_PRO, PlanType.OLD_TEAM, PlanType.ENTERPRISE],
  [Permission.BULK_UPLOAD]: [PlanType.STUDENT, PlanType.PRO, PlanType.OLD_PRO, PlanType.TEAM, PlanType.OLD_TEAM, PlanType.ENTERPRISE],
  [Permission.SHARE_PROTOTYPE]: [
    PlanType.STUDENT,
    PlanType.OLD_STARTER,
    PlanType.PRO,
    PlanType.OLD_PRO,
    PlanType.TEAM,
    PlanType.OLD_TEAM,
    PlanType.ENTERPRISE,
    PlanType.OLD_ENTERPRISE,
  ],
  [Permission.SHARE_PROJECT]: [
    PlanType.STUDENT,
    PlanType.OLD_STARTER,
    PlanType.PRO,
    PlanType.OLD_PRO,
    PlanType.TEAM,
    PlanType.OLD_TEAM,
    PlanType.ENTERPRISE,
    PlanType.OLD_ENTERPRISE,
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
