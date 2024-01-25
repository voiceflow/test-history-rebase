import { PlanType } from '@voiceflow/internal';

import { PLAN_TYPE_META, STARTER_PLANS } from '@/constants';

export const isPlanFactory = (plans: PlanType[] | ReadonlyArray<PlanType>) => (plan: PlanType | null | undefined) => !!plan && plans.includes(plan);

export const isStarterPlan = isPlanFactory(STARTER_PLANS);

export const getPlanTypeLabel = (planType: PlanType) => PLAN_TYPE_META[planType].label;
