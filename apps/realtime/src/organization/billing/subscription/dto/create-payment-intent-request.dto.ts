import { z } from 'zod';

export const CreatePaymentIntentRequest = z.object({
  amount: z.number(),
  referenceID: z.string().optional(),
  customerID: z.string().optional(),
});

export type CreatePaymentIntentRequest = z.infer<typeof CreatePaymentIntentRequest>;
