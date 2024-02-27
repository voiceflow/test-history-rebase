import { z } from 'zod';

export const CreditCardDTO = z.object({
  // credit card
  number: z.string(),
  expiryMonth: z.number(),
  expiryYear: z.number(),
  cvv: z.string(),

  // aditional info
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  billingAddr1: z.string().optional(),
  billingCity: z.string().optional(),
  billingState: z.string().optional(),
  billingCountry: z.string().optional(),
});

export type CreditCard = z.infer<typeof CreditCardDTO>;
