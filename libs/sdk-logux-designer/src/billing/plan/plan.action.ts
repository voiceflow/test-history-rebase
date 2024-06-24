import type { BillingPlan } from '@voiceflow/dtos';

import { createCRUD } from '@/crud/crud.action';
import type { ReplaceRequest } from '@/crud/crud.interface';

import { PLAN_KEY } from './plan.constants';

export const planAction = createCRUD(PLAN_KEY);

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends ReplaceRequest<BillingPlan> {}

export const Replace = planAction.crud.replace<Replace>();
