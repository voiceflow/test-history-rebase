import { PlanType } from '@voiceflow/internal';

import { PLAN_LIMITS, PlanLimitKey, PlanLimits } from '@/config/planLimitV2';
import { LimitType } from '@/constants/limits';

export type PlanLimitConfig<L extends LimitType> = L extends PlanLimitKey ? PlanLimits[L]['limits'][keyof PlanLimits[L]['limits']] : never;

export const isSupportedPlanLimit = (limit: LimitType): limit is PlanLimitKey => limit in PLAN_LIMITS;

/**
 * returns plan permission config, `null` if permission is not supported or permission is allowed for the plan
 */
export const getPlanLimitConfig = <L extends LimitType>(limit: L, plan: PlanType): PlanLimitConfig<L> | null => {
  if (!isSupportedPlanLimit(limit)) return null;

  const limits = PLAN_LIMITS[limit]?.limits;

  return (limits?.[plan as keyof typeof limits] as PlanLimitConfig<L>) || null;
};
