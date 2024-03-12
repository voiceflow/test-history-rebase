import { SubscriptionPaymentMethodDTO } from '@voiceflow/dtos';
import { z } from 'zod';

export const UpsertCustomerCardResponse = z.object({
  paymentMethod: SubscriptionPaymentMethodDTO,
});

export type UpsertCustomerCardResponse = z.infer<typeof UpsertCustomerCardResponse>;
