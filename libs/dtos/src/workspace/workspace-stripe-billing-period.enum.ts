import type { Enum } from '@/utils/type/enum.util';

export const StripeBillingPeriod = {
  MONTHLY: 'MO',
  ANNUALLY: 'YR',
};

export type StripeBillingPeriod = Enum<typeof StripeBillingPeriod>;
