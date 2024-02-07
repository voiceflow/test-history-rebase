import { PlanType } from '@voiceflow/internal';

export const isPlanType = (plan: any): plan is PlanType => plan in PlanType;
