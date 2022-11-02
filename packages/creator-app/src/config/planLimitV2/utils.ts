import { PlanType } from '@voiceflow/internal';

import { ENTERPRISE_PLANS, STARTER_PLANS, TEAM_PLANS } from '@/constants/plans';

export const applyLimitsToPlans = <Limit, Plan extends PlanType>(plans: Plan[] | ReadonlyArray<Plan>, limit: Limit): Record<Plan, Limit> =>
  Object.fromEntries(plans.map((plan) => [plan, limit])) as Record<Plan, Limit>;

export const applyAllLimits = <Limit>(limit: Limit) => applyLimitsToPlans(Object.values(PlanType), limit);

export const applyTeamLimits = <Limit>(limit: Limit) => applyLimitsToPlans(TEAM_PLANS, limit);

export const applyStarterLimits = <Limit>(limit: Limit) => applyLimitsToPlans(STARTER_PLANS, limit);

export const applyEnterpriseLimits = <Limit>(limit: Limit) => applyLimitsToPlans(ENTERPRISE_PLANS, limit);
