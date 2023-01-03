import { PlanType } from '@voiceflow/internal';

import { LIMITS, Limits, LimitType } from '@/config/planLimitV2';

export const getPlanLimit = <Limit extends LimitType>(limit: Limit, plan: PlanType): NonNullable<Limits[Limit][PlanType]> | null =>
  LIMITS[limit]?.[plan] || null;
