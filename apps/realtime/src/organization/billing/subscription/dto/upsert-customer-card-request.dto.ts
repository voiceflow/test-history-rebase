import { z } from 'zod';

export const UpsertCustomerCardRequest = z.object({
  paymentIntentID: z.string(),
  customerID: z.string(),
});

export type UpsertCustomerCardRequest = z.infer<typeof UpsertCustomerCardRequest>;
