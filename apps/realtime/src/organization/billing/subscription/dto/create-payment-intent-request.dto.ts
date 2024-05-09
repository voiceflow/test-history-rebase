import { z } from 'zod';

export const CreatePaymentIntentRequest = z.object({
  amount: z.number(),
});

export type CreatePaymentIntentRequest = z.infer<typeof CreatePaymentIntentRequest>;
