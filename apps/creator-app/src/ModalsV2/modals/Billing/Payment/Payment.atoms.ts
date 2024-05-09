import { BillingPlan, PaymentIntent } from '@voiceflow/dtos';
import { BillingPeriod } from '@voiceflow/internal';
import { atom } from 'jotai';

import { ACTIVE_PAID_PLAN } from '@/constants';

import { Step } from './Payment.constants';

type PriceMap = Record<BillingPeriod, { value: number; id: string }>;

export const stepAtom = atom(Step.PLAN);

export const editorSeatsAtom = atom(1);
export const periodAtom = atom(BillingPeriod.ANNUALLY);

export const plansAtom = atom<BillingPlan[]>([]);

export const plansPriceAtom = atom<Record<string, PriceMap>>((get) => {
  return get(plansAtom).reduce((acc, plan) => {
    return {
      ...acc,
      [plan.id]: plan.prices.reduce(
        (acc, price) => ({
          ...acc,
          [price.period]: { value: price.period === BillingPeriod.ANNUALLY ? price.price / 12 : price.price, id: price.id },
        }),
        {}
      ),
    };
  }, {});
});
export const activePaidPlanPricesAtom = atom<PriceMap | null>((get) => get(plansPriceAtom)[ACTIVE_PAID_PLAN] ?? null);
export const selectedPlanPriceAtom = atom((get) => get(activePaidPlanPricesAtom)?.[get(periodAtom)] ?? null);

export const paymentIntentAtom = atom<PaymentIntent | null>(null);

export const couponIdsAtom = atom<string[]>([]);
