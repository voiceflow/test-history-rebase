import { PlanType } from '@voiceflow/internal';

import { Permission } from '@/constants/permissions';
import {
  ALL_PLANS,
  ENTERPRISE_PLANS,
  NON_ENTERPRISE_PAID_PLANS,
  NON_ENTERPRISE_PLANS,
  PAID_PLANS,
  STARTER_PLANS,
  TEAM_PLANS,
  TEAM_PLUS_PLANS,
  TEAM_STUDENT_PLUS_PLANS,
} from '@/constants/plans';

import { BULK_UPLOAD_PERMISSIONS } from './bulkUpload';
import { CANVAS_EXPORT_PERMISSIONS } from './canvasExport';
import { CANVAS_PAID_STEPS } from './canvasPaidSteps';
import { NLU_CONFLICTS_PERMISSIONS } from './nluConflicts';
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
  NLU_CONFLICTS_PERMISSIONS,
  CANVAS_EXPORT_PERMISSIONS,
  NLU_EXPORT_ALL_PERMISSIONS,
  NLU_EXPORT_CSV_PERMISSIONS,
  WORKSPACE_CREATE_PERMISSIONS,

  // all plans
  { permission: Permission.COMMENTING, plans: ALL_PLANS },
  { permission: Permission.PROJECT_SHARE, plans: ALL_PLANS },
  { permission: Permission.CANVAS_REALTIME, plans: ALL_PLANS },
  { permission: Permission.SHARE_PROTOTYPE, plans: ALL_PLANS },

  // non enterprise plans
  { permission: Permission.BILLING_SEATS_ADD, plans: NON_ENTERPRISE_PLANS },

  { permission: Permission.BILLING_SEATS_SCHEDULE, plans: NON_ENTERPRISE_PAID_PLANS },

  // paid plans
  { permission: Permission.MODEL_EXPORT, plans: PAID_PLANS },
  { permission: Permission.PROJECT_FULL_VERSIONS, plans: PAID_PLANS },

  // team only plans
  { permission: Permission.BILLING_SEATS, plans: TEAM_PLANS },

  // team+ plans
  { permission: Permission.CUSTOMIZE_PROTOTYPE, plans: TEAM_PLUS_PLANS },
  { permission: Permission.TRANSCRIPTS_ENABLED, plans: TEAM_STUDENT_PLUS_PLANS },
  { permission: Permission.MODAL_PDF_PNG_EXPORT, plans: TEAM_PLUS_PLANS },
  { permission: Permission.SHARE_PROTOTYPE_PASSWORD, plans: TEAM_PLUS_PLANS },

  // enterprise only plans
  { permission: Permission.CODE_EXPORT, plans: ENTERPRISE_PLANS },
  { permission: Permission.AI_PLAYGROUND_DISCLAIMER, plans: ENTERPRISE_PLANS },

  // new enterprise only
  { permission: Permission.ORGANIZATION_CONFIGURE_SSO, plans: [PlanType.ENTERPRISE] },
  { permission: Permission.EDIT_ORGANIZATION, plans: [PlanType.ENTERPRISE] },
  { permission: Permission.ORGANIZATION_MANAGE_MEMBERS, plans: [PlanType.ENTERPRISE] },

  // other
  { permission: Permission.BILLING_MANAGE, plans: [...STARTER_PLANS, ...TEAM_PLANS, PlanType.CREATOR] },
]);

export type PlanPermissions = typeof PLAN_PERMISSIONS;
export type PlanPermissionKey = keyof PlanPermissions;
