import { PlanType } from '@voiceflow/internal';

import { Permission } from '@/config/permissions';
import { PLAN_PERMISSIONS, PlanPermissions } from '@/config/planPermission';
import { ENTERPRISE_PLANS, PLAN_TYPE_META, STARTER_PLANS, TEAM_PLANS } from '@/constants';

const isPlanFactory = (plans: PlanType[] | ReadonlyArray<PlanType>) => (plan: PlanType | null | undefined) => plan && plans.includes(plan);

export const isTeamPlan = isPlanFactory(TEAM_PLANS);

export const isStarterPlan = isPlanFactory(STARTER_PLANS);

export const isEnterprisePlan = isPlanFactory(ENTERPRISE_PLANS);

export const getPlanTypeLabel = (planType: PlanType) => PLAN_TYPE_META[planType].label;

export type PlanPermission<P extends Permission> = P extends keyof PlanPermissions ? NonNullable<PlanPermissions[P][PlanType]> : never;

export const getPlanPermission = <P extends Permission>(permission: P, plan: PlanType): PlanPermission<P> | null =>
  (PLAN_PERMISSIONS as Partial<Record<Permission, any>>)[permission]?.[plan] ?? null;
