import { z } from 'zod';

export const SubscriptionAddonDTO = z.object({
  itemPriceID: z.string(),
  itemType: z.string(),
  quantity: z.number().optional(),
  unitPrice: z.number().optional(),
  amount: z.number().optional(),
});

export type SubscriptionAddon = z.infer<typeof SubscriptionAddonDTO>;
