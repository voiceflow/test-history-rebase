import { PlanType } from '@voiceflow/internal';

import { Permission } from '@/constants/permissions';
import {
  ALL_PLANS,
  ENTERPRISE_PLANS,
  NON_ENTERPRISE_PAID_PLANS,
  NON_ENTERPRISE_PLANS,
  PAID_PLANS,
  PRO_AND_TEAM_PLANS,
  PRO_PLUS_PLANS,
} from '@/constants/plans';

import { ADVANCED_AI_MODELS_PERMISSIONS } from './advancedAIModels';
import { BULK_UPLOAD_PERMISSIONS } from './bulkUpload';
import { CANVAS_EXPORT_PERMISSIONS } from './canvasExport';
import { CANVAS_PAID_STEPS } from './canvasPaidSteps';
import { KB_REFRESH_RATE_PERMISSIONS } from './kbRefreshRate';
import { NLU_CUSTOM_PERMISSIONS } from './nluCustom';
import { NLU_EXPORT_ALL_PERMISSIONS } from './nluExportAll';
import { NLU_EXPORT_CSV_PERMISSIONS } from './nluExportCSV';
import { buildPlanPermissionRecord } from './utils';
import { WORKSPACE_CREATE_PERMISSIONS } from './workspaceCreate';

export * from './types';

export const PLAN_PERMISSIONS = buildPlanPermissionRecord([
  // configurable
  CANVAS_PAID_STEPS,
  NLU_CUSTOM_PERMISSIONS,
  BULK_UPLOAD_PERMISSIONS,
  CANVAS_EXPORT_PERMISSIONS,
  NLU_EXPORT_ALL_PERMISSIONS,
  NLU_EXPORT_CSV_PERMISSIONS,
  WORKSPACE_CREATE_PERMISSIONS,
  ADVANCED_AI_MODELS_PERMISSIONS,
  KB_REFRESH_RATE_PERMISSIONS,

  // all plans
  { permission: Permission.FEATURE_COMMENTING, plans: ALL_PLANS },
  { permission: Permission.PROJECT_SHARE, plans: ALL_PLANS },
  { permission: Permission.PROJECT_PROTOTYPE_SHARE, plans: ALL_PLANS },

  // non enterprise plans
  { permission: Permission.BILLING_SEATS_ADD, plans: NON_ENTERPRISE_PLANS },

  { permission: Permission.BILLING_SEATS_SCHEDULE, plans: NON_ENTERPRISE_PAID_PLANS },

  // paid plans
  { permission: Permission.MODEL_EXPORT, plans: PAID_PLANS },
  { permission: Permission.PROJECT_FULL_VERSIONS, plans: PAID_PLANS },

  // pro and team only plans
  { permission: Permission.BILLING_SEATS, plans: PRO_AND_TEAM_PLANS },

  // pro+ plans
  { permission: Permission.PROJECT_PROTOTYPE_PROTOTYPE, plans: PRO_PLUS_PLANS },
  { permission: Permission.PROJECT_PROTOTYPE_PASSWORD, plans: PRO_PLUS_PLANS },

  // enterprise only plans
  { permission: Permission.CODE_EXPORT, plans: ENTERPRISE_PLANS },
  { permission: Permission.FEATURE_AI_PLAYGROUND, plans: ENTERPRISE_PLANS },

  // new enterprise only
  { permission: Permission.ORGANIZATION_CONFIGURE_SSO, plans: [PlanType.ENTERPRISE] },
  { permission: Permission.ORGANIZATION_UPDATE, plans: [PlanType.ENTERPRISE] },
  { permission: Permission.ORGANIZATION_MEMBER_MANAGE, plans: [PlanType.ENTERPRISE] },
]);

export type PlanPermissions = typeof PLAN_PERMISSIONS;
export type PlanPermissionKey = keyof PlanPermissions;
