import { z } from 'zod';

import { SubscriptionEntitlementsDTO } from './subscription-entitlements.dto';

export const SubscriptionDTO = z.object({
  id: z.string(),

  // status
  status: z.string(),
  hasScheduledChanges: z.boolean().optional(),

  // billing
  nextBillingDate: z.string().optional().nullable(),
  billingPeriodUnit: z.string().optional().nullable(),

  // trial
  trial: z
    .object({
      daysLeft: z.number(),
      endAt: z.string(),
    })
    .optional()
    .nullable(),

  // plan
  plan: z.string(),
  pricePerEditor: z.number(),
  planPrice: z.number(),

  // seats
  editorSeats: z.number(),
  planSeatLimits: z.object({
    editor: z.number(),
    viewer: z.number(),
  }),

  customerID: z.string(),

  entitlements: SubscriptionEntitlementsDTO,
});

export type Subscription = z.infer<typeof SubscriptionDTO>;
