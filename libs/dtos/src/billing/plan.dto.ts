import { BillingPeriod } from '@voiceflow/internal';
import { z } from 'zod';

export const BillingCheckoutPlan = z.object({
  itemPriceID: z.string(),
  planPrice: z.number(),
  editorSeats: z.number(),
  period: z.nativeEnum(BillingPeriod),
});

export const BillingPlanDTO = z.object({
  id: z.string(),
  name: z.string(),
  prices: z.array(
    z.object({
      id: z.string(),
      price: z.number(),
      period: z.nativeEnum(BillingPeriod),
    })
  ),
});

export type BillingPlan = z.infer<typeof BillingPlanDTO>;

export type BillingCheckoutPlan = z.infer<typeof BillingCheckoutPlan>;
