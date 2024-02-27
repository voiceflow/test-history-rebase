import { z } from 'nestjs-zod/z';

export const CheckoutRequest = z.object({
  itemPriceID: z.string(),
  editorSeats: z.number(),
});

export type CheckoutRequest = z.infer<typeof CheckoutRequest>;
