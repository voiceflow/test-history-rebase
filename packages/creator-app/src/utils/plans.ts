import { PlanType } from '@voiceflow/internal';

import { PLAN_TYPE_META } from '@/constants';

export const getPlanTypeLabel = (planType: PlanType) => {
  return PLAN_TYPE_META[planType].label;
};
