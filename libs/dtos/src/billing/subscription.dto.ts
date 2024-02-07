import { z } from 'zod';

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

  plan: z.string(),
  editorSeats: z.number(),
  pricePerEditor: z.number(),

  planSeatLimits: z.object({
    editor: z.number(),
    viewer: z.number(),
  }),
  variableStatesLimit: z.number().nullable(),
});

export type Subscription = z.infer<typeof SubscriptionDTO>;
