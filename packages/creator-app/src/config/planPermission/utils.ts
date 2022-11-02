import { PlanType } from '@voiceflow/internal';

import { ENTERPRISE_PLANS, STARTER_PLANS, TEAM_PLANS } from '@/constants/plans';

export const applyPermissionsToPlans = <Permission, Plan extends PlanType>(
  plans: Plan[] | ReadonlyArray<Plan>,
  permission: Permission
): Record<Plan, Permission> => Object.fromEntries(plans.map((plan) => [plan, permission])) as Record<Plan, Permission>;

export const applyAllPermissions = <Permission>(permission: Permission) => applyPermissionsToPlans(Object.values(PlanType), permission);

export const applyTeamPermissions = <Permission>(permission: Permission) => applyPermissionsToPlans(TEAM_PLANS, permission);

export const applyStarterPermissions = <Permission>(permission: Permission) => applyPermissionsToPlans(STARTER_PLANS, permission);

export const applyEnterprisePermissions = <Permission>(permission: Permission) => applyPermissionsToPlans(ENTERPRISE_PLANS, permission);
