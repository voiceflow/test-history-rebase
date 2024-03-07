import { z } from 'zod';

import { SubscriptionEntitlementsDTO } from './subscription-entitlements.dto';

export const SubscriptionDTO = z.object({
  id: z.string(),

  status: z.enum(['future', 'in_trial', 'active', 'non_renewing', 'paused', 'cancelled', 'transferred']),
  nextBillingDate: z.string().nullable(),
  billingPeriodUnit: z.enum(['month', 'year']),

  trial: z
    .object({
      daysLeft: z.number(),
      endAt: z.string(),
    })
    .nullable(),

  plan: z.enum(['starter', 'pro', 'team', 'enterprise']),
  editorSeats: z.number(),
  pricePerEditor: z.number(),

  customerID: z.string(),

  entitlements: SubscriptionEntitlementsDTO,
});

export type Subscription = z.infer<typeof SubscriptionDTO>;
