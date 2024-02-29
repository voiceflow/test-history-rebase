import { z } from 'zod';

import { SubscriptionEntitlementsDTO } from './subscription-entitlements.dto';

export const SubscriptionDTO = z.object({
  id: z.string(),

  status: z.string(),
  nextBillingDate: z.string().optional().nullable(),
  billingPeriodUnit: z.string().optional().nullable(),

  trial: z
    .object({
      daysLeft: z.number(),
      endAt: z.string(),
    })
    .optional()
    .nullable(),

  plan: z.enum(['starter', 'pro', 'team', 'enterprise']),
  editorSeats: z.number(),
  pricePerEditor: z.number(),

  customerID: z.string(),

  entitlements: SubscriptionEntitlementsDTO,
});

export type Subscription = z.infer<typeof SubscriptionDTO>;
