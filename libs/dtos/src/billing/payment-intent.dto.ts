import { z } from 'zod';

export const PaymentIntentDTO = z.object({
  amount: z.number(),
  createdAt: z.number(),
  currencyCode: z.string(),
  expiresAt: z.number(),
  gateway: z.string(),
  gatewayAccountId: z.string(),
  id: z.string(),
  modifiedAt: z.number(),
  paymentMethodType: z.string(),
  status: z.string(),
  referenceID: z.string().optional(),
});

export type PaymentIntent = z.infer<typeof PaymentIntentDTO>;
