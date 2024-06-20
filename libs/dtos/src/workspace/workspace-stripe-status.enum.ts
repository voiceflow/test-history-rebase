import { Enum } from '@/utils/type/enum.util';

export const StripeStatus = {
  CANCELED: 'canceled',
  ACTIVE: 'active',
  UNPAID: 'unpaid',
  INCOMPLETE_EXPIRED: 'incomplete_expired',
  INCOMPLETE: 'incomplete',
  PAST_DUE: 'past_due',
};

export type StripeStatus = Enum<typeof StripeStatus>;
