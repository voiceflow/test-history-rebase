import { PlanType } from '@voiceflow/internal';

import { Permission } from '@/constants/permissions';
import {
  ALL_PLANS,
  NON_ENTERPRISE_PAID_PLANS,
  NON_ENTERPRISE_PLANS,
  PAID_PLANS,
  PRO_AND_TEAM_PLANS,
  PRO_PLUS_PLANS,
} from '@/constants/plans';

import { ADVANCED_AI_MODELS_PERMISSIONS } from './advancedAIModels';
import { KB_REFRESH_RATE_PERMISSIONS } from './kbRefreshRate';
import { buildPlanPermissionRecord } from './utils';
import { WORKSPACE_CREATE_PERMISSIONS } from './workspaceCreate';

export * from './types';

export const PLAN_PERMISSIONS = buildPlanPermissionRecord([
  // configurable
  WORKSPACE_CREATE_PERMISSIONS,
  ADVANCED_AI_MODELS_PERMISSIONS,
  KB_REFRESH_RATE_PERMISSIONS,

  // all plans
  { permission: Permission.PROJECT_COMMENT, plans: ALL_PLANS },
  { permission: Permission.FEATURE_SHARE_PROJECT, plans: ALL_PLANS },
  { permission: Permission.PROJECT_PROTOTYPE_SHARE, plans: ALL_PLANS },

  // non enterprise plans
  { permission: Permission.WORKSPACE_BILLING_ADD_SEATS, plans: NON_ENTERPRISE_PLANS },

  { permission: Permission.FEATURE_SCHEDULE_SEATS, plans: NON_ENTERPRISE_PAID_PLANS },

  // paid plans
  { permission: Permission.FEATURE_EXPORT_MODEL, plans: PAID_PLANS },

  // pro and team only plans
  { permission: Permission.FEATURE_MANAGE_SEATS, plans: PRO_AND_TEAM_PLANS },

  // pro+ plans
  { permission: Permission.PROJECT_PROTOTYPE_SHARE_PASSWORD, plans: PRO_PLUS_PLANS },

  // new enterprise only
  { permission: Permission.ORGANIZATION_CONFIGURE_SSO, plans: [PlanType.ENTERPRISE] },
  { permission: Permission.ORGANIZATION_UPDATE, plans: [PlanType.ENTERPRISE] },
  { permission: Permission.ORGANIZATION_MANAGE_MEMBERS, plans: [PlanType.ENTERPRISE] },
]);

export type PlanPermissions = typeof PLAN_PERMISSIONS;
export type PlanPermissionKey = keyof PlanPermissions;
