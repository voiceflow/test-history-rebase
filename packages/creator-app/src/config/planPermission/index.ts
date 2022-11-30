import { Permission } from '@/config/permissions';

import { BULK_UPLOAD_PERMISSIONS } from './bulkUpload';
import { CUSTOM_NLU_PERMISSIONS } from './customNLU';

export * from './types';

export const PLAN_PERMISSIONS = {
  [Permission.NLU_CUSTOM]: CUSTOM_NLU_PERMISSIONS,
  [Permission.BULK_UPLOAD]: BULK_UPLOAD_PERMISSIONS,
} as const;

export type PlanPermissions = typeof PLAN_PERMISSIONS;
export type PlanPermissionKey = keyof PlanPermissions;
