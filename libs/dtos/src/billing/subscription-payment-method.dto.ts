import { z } from 'zod';

export const SubscriptionPaymentMethodStatus = {
  VALID: 'valid',
  EXPIRING: 'expiring',
  EXPIRED: 'expired',
  INVALID: 'invalid',
  PENDING_VERIFICATION: 'pending_verification',
} as const;

export type SubscriptionPaymentMethodStatusType =
  (typeof SubscriptionPaymentMethodStatus)[keyof typeof SubscriptionPaymentMethodStatus];

export const SubscriptionPaymentMethodCardDTO = z.object({
  iin: z.string(),
  last4: z.string(),
  expiryMonth: z.number(),
  expiryYear: z.number(),
  maskedNumber: z.string(),
  brand: z.string(),
});

export const SubscriptionPaymentMethodAddressDTO = z.object({
  billingAddr1: z.string(),
  billingCity: z.string(),
  billingStateCode: z.string(),
  billingState: z.string(),
  billingCountry: z.string(),
});

export const SubscriptionPaymentMethodDTO = z.object({
  id: z.string(),
  status: z.nativeEnum(SubscriptionPaymentMethodStatus),
  failed: z.boolean(),
  card: SubscriptionPaymentMethodCardDTO,
  billingAddress: SubscriptionPaymentMethodAddressDTO,
  referenceID: z.string(),
});

export type SubscriptionPaymentMethod = z.infer<typeof SubscriptionPaymentMethodDTO>;
export type SubscriptionPaymentMethodCard = z.infer<typeof SubscriptionPaymentMethodCardDTO>;
export type SubscriptionPaymentMethodAddress = z.infer<typeof SubscriptionPaymentMethodAddressDTO>;
