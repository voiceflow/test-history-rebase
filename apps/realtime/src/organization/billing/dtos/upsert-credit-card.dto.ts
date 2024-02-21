import { z } from 'zod';

export const UpsertCreditCardRequest = z.object({
  firstName: z.string().optional(),
  lastLame: z.string().optional(),
  billingAddr1: z.string().optional(),
  billingAddr2: z.string().optional(),
  billingCity: z.string().optional(),
  billingStateCode: z.string().optional(),
  billingState: z.string().optional(),
  billingZip: z.string().optional(),
  billingCountry: z.string().optional(),
  tempToken: z.string().optional(),
});

export type UpsertCreditCardRequest = z.infer<typeof UpsertCreditCardRequest>;
