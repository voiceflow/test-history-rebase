import { z } from 'zod';

import { BillingPeriodUnitDTO } from './period-unit.dto';
import { PlanNameDTO } from './plan-name.dto';

export const BillingPriceDTO = z.object({
  id: z.string(),
  amount: z.number(),
  monthlyAmount: z.number(),
  annualAmount: z.number(),
  periodUnit: BillingPeriodUnitDTO,
});

export const BillingPlanDTO = z.object({
  id: PlanNameDTO,
  name: z.string(),
  description: z.string(),
  pricesByPeriodUnit: z.record(BillingPeriodUnitDTO, BillingPriceDTO),
  seats: z.number(),
});

export type BillingPlan = z.infer<typeof BillingPlanDTO>;

export type BillingPrice = z.infer<typeof BillingPriceDTO>;
