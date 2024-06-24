import type { BillingPlan } from '@voiceflow/dtos';
import { createEmpty, type Normalized } from 'normal-store';

export interface BillingPlanState extends Normalized<BillingPlan> {}
export const INITIAL_STATE: BillingPlanState = createEmpty();

export const STATE_KEY = 'billingPlan';
