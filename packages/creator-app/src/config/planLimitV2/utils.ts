import { PlanType } from '@voiceflow/internal';

import { ENTERPRISE_LIMIT_PLANS, STARTER_LIMIT_PLANS, TEAM_LIMIT_PLANS } from './constants';
import { BaseLimit } from './types';

export const applyLimitsToPlans = <Limit extends BaseLimit, Plan extends PlanType>(
  plans: Plan[] | ReadonlyArray<Plan>,
  limit: Limit
): Record<Plan, Limit> => Object.fromEntries(plans.map((plan) => [plan, limit])) as Record<Plan, Limit>;

export const applyAllLimits = <Limit extends BaseLimit>(limit: Limit) => applyLimitsToPlans(Object.values(PlanType), limit);

export const applyTeamLimits = <Limit extends BaseLimit>(limit: Limit) => applyLimitsToPlans(TEAM_LIMIT_PLANS, limit);

export const applyStarterLimits = <Limit extends BaseLimit>(limit: Limit) => applyLimitsToPlans(STARTER_LIMIT_PLANS, limit);

export const applyEnterpriseLimits = <Limit extends BaseLimit>(limit: Limit) => applyLimitsToPlans(ENTERPRISE_LIMIT_PLANS, limit);
