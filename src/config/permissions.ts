import { PlanType, UserRole } from '@/constants';

export enum Permission {
  ADD_COLLABORATORS = 'ADD_COLLABORATORS',
  VIEW_COLLABORATORS = 'VIEW_COLLABORATORS',
  WORKSPACE_SETTINGS = 'WORKSPACE_SETTINGS',
  UPGRADE_WORKSPACE = 'UPGRADE_WORKSPACE',
  EDIT_CANVAS = 'EDIT_CANVAS',
  INTERACTION_MODAL = 'INTERACTION_MODAL',
  DASHBOARD_LIST = 'DASHBOARD_LIST',
  DASHBOARD_PROJECT = 'DASHBOARD_PROJECT',
  MARKUP = 'MARKUP',
  COMMENTING = 'COMMENTING',
  EXPORT = 'EXPORT',
  BULK_UPLOAD = 'BULK_UPLOAD',
  SHARE_PROTOTYPE = 'SHARE_PROTOTYPE',
  PROJECT_DOWNLOAD = 'PROJECT_DOWNLOAD',
  CLONE_DASHBOARD_PROJECT = 'CLONE_DASHBOARD_PROJECT',
  CLONE_PROJECT = 'CLONE_PROJECT',
  REALTIME = 'REALTIME',
  VISIBLE_PAID_CANVAS_CONTROLS = 'VISIBLE_PAID_CANVAS_CONTROLS',
}

export const ROLE_PERMISSIONS: Partial<Record<Permission, UserRole[]>> = {
  [Permission.ADD_COLLABORATORS]: [UserRole.ADMIN],
  [Permission.VIEW_COLLABORATORS]: [UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER],
  [Permission.WORKSPACE_SETTINGS]: [UserRole.ADMIN],
  [Permission.UPGRADE_WORKSPACE]: [UserRole.ADMIN],
  [Permission.EDIT_CANVAS]: [UserRole.ADMIN, UserRole.EDITOR],
  [Permission.INTERACTION_MODAL]: [UserRole.ADMIN, UserRole.EDITOR],
  [Permission.DASHBOARD_LIST]: [UserRole.ADMIN, UserRole.EDITOR],
  [Permission.DASHBOARD_PROJECT]: [UserRole.ADMIN, UserRole.EDITOR],
  [Permission.MARKUP]: [UserRole.ADMIN, UserRole.EDITOR],
  [Permission.COMMENTING]: [UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER],
  [Permission.REALTIME]: [UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER],
  [Permission.CLONE_DASHBOARD_PROJECT]: [UserRole.LIBRARY],
  [Permission.CLONE_PROJECT]: [UserRole.ADMIN, UserRole.EDITOR],
  [Permission.VISIBLE_PAID_CANVAS_CONTROLS]: [UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER],
};

export const PLAN_PERMISSIONS: Partial<Record<Permission, PlanType[]>> = {
  [Permission.MARKUP]: [PlanType.PRO, PlanType.OLD_PRO, PlanType.TEAM, PlanType.OLD_TEAM, PlanType.ENTERPRISE],
  [Permission.EXPORT]: [PlanType.PRO, PlanType.OLD_PRO, PlanType.TEAM, PlanType.OLD_TEAM, PlanType.ENTERPRISE],
  [Permission.COMMENTING]: [PlanType.TEAM, PlanType.OLD_TEAM, PlanType.ENTERPRISE],
  [Permission.BULK_UPLOAD]: [PlanType.PRO, PlanType.OLD_PRO, PlanType.TEAM, PlanType.OLD_TEAM, PlanType.ENTERPRISE],
  [Permission.SHARE_PROTOTYPE]: [
    PlanType.OLD_STARTER,
    PlanType.PRO,
    PlanType.OLD_PRO,
    PlanType.TEAM,
    PlanType.OLD_TEAM,
    PlanType.ENTERPRISE,
    PlanType.OLD_ENTERPRISE,
  ],
  [Permission.PROJECT_DOWNLOAD]: [
    PlanType.OLD_STARTER,
    PlanType.PRO,
    PlanType.OLD_PRO,
    PlanType.TEAM,
    PlanType.OLD_TEAM,
    PlanType.ENTERPRISE,
    PlanType.OLD_ENTERPRISE,
  ],
};

export const hasPermission = (permission: Permission, role: UserRole, plan: PlanType) => {
  const hasRolePermission = !ROLE_PERMISSIONS[permission] || ROLE_PERMISSIONS[permission]!.includes(role);
  const hasPlanPermission = !PLAN_PERMISSIONS[permission] || PLAN_PERMISSIONS[permission]!.includes(plan);

  return hasRolePermission && hasPlanPermission;
};
