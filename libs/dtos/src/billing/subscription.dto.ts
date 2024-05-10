import { z } from 'zod';

import { BillingPeriodUnitDTO } from './period-unit.dto';
import { PlanNameDTO } from './plan-name.dto';
import { SubscriptionEntitlementsDTO } from './subscription-entitlements.dto';
import { SubscriptionPaymentMethodDTO } from './subscription-payment-method.dto';
import { SubscriptionStatusDTO } from './subscription-status.dto';

export const SubscriptionDTO = z.object({
  id: z.string(),

  status: SubscriptionStatusDTO,
  nextBillingDate: z.string().nullable(),
  nextBillingAt: z.number().nullable(),
  billingPeriodUnit: BillingPeriodUnitDTO,

  trial: z
    .object({
      daysLeft: z.number(),
      endAt: z.string(),
    })
    .nullable(),

  plan: PlanNameDTO,
  editorSeats: z.number(),
  planAmount: z.number(),

  customerID: z.string(),

  entitlements: SubscriptionEntitlementsDTO,

  paymentMethod: SubscriptionPaymentMethodDTO.optional(),
  onDunningPeriod: z.boolean(),
});

export type Subscription = z.infer<typeof SubscriptionDTO>;
