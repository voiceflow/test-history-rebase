import { PlanType } from '@voiceflow/internal';

import { ENTERPRISE_PLANS, PERSONAL_PLANS, PRO_PLANS, STARTER_PLANS, TEAM_PLANS } from '@/constants/plans';

import { PlanLimit } from './types';

export const applyLimitsToPlans = <Limit, Plan extends PlanType>(plans: Plan[] | ReadonlyArray<Plan>, limit: Limit): Record<Plan, Limit> =>
  Object.fromEntries(plans.map((plan) => [plan, limit])) as Record<Plan, Limit>;

export const applyAllLimits = <Limit>(limit: Limit) => applyLimitsToPlans(Object.values(PlanType), limit);

export const applyProLimits = <Limit>(limit: Limit) => applyLimitsToPlans(PRO_PLANS, limit);

export const applyTeamLimits = <Limit>(limit: Limit) => applyLimitsToPlans(TEAM_PLANS, limit);

export const applyStarterLimits = <Limit>(limit: Limit) => applyLimitsToPlans(STARTER_PLANS, limit);

export const applyPersonalLimits = <Limit>(limit: Limit) => applyLimitsToPlans(PERSONAL_PLANS, limit);

export const applyEnterpriseLimits = <Limit>(limit: Limit) => applyLimitsToPlans(ENTERPRISE_PLANS, limit);

type PlanLimitRecord<P extends PlanLimit> = { [K in P['limit']]: Extract<P, { limit: K }> };

export const buildPlanLimitRecord = <P extends PlanLimit>(limits: ReadonlyArray<P>): PlanLimitRecord<P> =>
  Object.fromEntries(limits.map((limit) => [limit.limit, limit])) as PlanLimitRecord<P>;
