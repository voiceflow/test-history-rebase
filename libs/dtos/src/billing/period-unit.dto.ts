import { z } from 'zod';

export const BillingPeriodUnit = {
  MONTH: 'month',
  YEAR: 'year',
} as const;

export const BillingPeriodUnitDTO = z.nativeEnum(BillingPeriodUnit);

export type BillingPeriodUnit = (typeof BillingPeriodUnit)[keyof typeof BillingPeriodUnit];
