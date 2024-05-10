import { z } from 'zod';

export const SubscriptionStatus = {
  FUTURE: 'future',
  IN_TRIAL: 'in_trial',
  ACTIVE: 'active',
  NON_RENEWING: 'non_renewing',
  PAUSED: 'paused',
  CANCELLED: 'cancelled',
  TRANSFERRED: 'transferred',
} as const;

export const SubscriptionStatusDTO = z.nativeEnum(SubscriptionStatus);

export type SubscriptionStatus = (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];
