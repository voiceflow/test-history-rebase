import { Utils } from '@voiceflow/common';
import type { PlanType } from '@voiceflow/internal';

import type { PlanPermissionKey, PlanPermissions } from '@/config/planPermission';
import { PLAN_PERMISSIONS } from '@/config/planPermission';
import type { Permission } from '@/constants/permissions';

export type PlanPermissionConfig<P extends Permission> = P extends PlanPermissionKey ? PlanPermissions[P] : never;

export const isSupportedPlanPermission = (permission: Permission): permission is PlanPermissionKey =>
  permission in PLAN_PERMISSIONS;

export const getPlanPermissionConfig = <P extends Permission>(permission: P): PlanPermissionConfig<P> | null => {
  if (!isSupportedPlanPermission(permission)) return null;

  return PLAN_PERMISSIONS[permission] as PlanPermissionConfig<P>;
};

/**
 * returns plan permission config, `null` if permission is not supported or permission is allowed for the plan
 */
export const verifyPlanPermissionConfig = <P extends Permission>(
  permission: P,
  plan: PlanType
): PlanPermissionConfig<P> | null => {
  const planPermissionConfig = getPlanPermissionConfig(permission);

  if (!planPermissionConfig) return null;

  return Utils.array.inferUnion<PlanType[]>(planPermissionConfig.plans).includes(plan) ? null : planPermissionConfig;
};

export const hasPlanPermission = (permission: Permission, plan: PlanType): boolean =>
  verifyPlanPermissionConfig(permission, plan) === null;
