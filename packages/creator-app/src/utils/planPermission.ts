import { PlanType } from '@voiceflow/internal';

import { Permission } from '@/config/permissions';
import { PLAN_PERMISSIONS, PlanPermissions } from '@/config/planPermission';

export type PlanPermission<P extends Permission> = P extends keyof PlanPermissions ? NonNullable<PlanPermissions[P][PlanType]> : never;

export const getPlanPermission = <P extends Permission>(permission: P, plan: PlanType): PlanPermission<P> | null =>
  (PLAN_PERMISSIONS as Partial<Record<Permission, any>>)[permission]?.[plan] ?? null;
