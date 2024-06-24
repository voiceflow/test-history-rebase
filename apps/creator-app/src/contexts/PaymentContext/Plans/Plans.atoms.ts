import { BillingPeriodUnit, BillingPlan, BillingPrice, PaymentIntent, PlanName } from '@voiceflow/dtos';
import { atom } from 'jotai';

import { DEFAULT_PAID_PLAN, DEFAULT_PERIOD } from '@/constants';

export const editorSeatsAtom = atom(1);
export const selectedPeriodAtom = atom<BillingPeriodUnit>(DEFAULT_PERIOD);
export const selectedPlanIDAtom = atom<PlanName>(DEFAULT_PAID_PLAN);

export const plansAtom = atom<BillingPlan[]>([]);

export const plansByIDAtom = atom<Record<string, BillingPlan>>((get) =>
  Object.fromEntries(get(plansAtom).map((plan) => [plan.id, plan]))
);
export const selectedPlanAtom = atom<BillingPlan | null>((get) => get(plansByIDAtom)[get(selectedPlanIDAtom)] ?? null);
export const selectedPlanPriceAtom = atom<BillingPrice | null>(
  (get) => get(selectedPlanAtom)?.pricesByPeriodUnit?.[get(selectedPeriodAtom)] ?? null
);

export const selectedPeriodAmountAtom = atom((get) => get(selectedPlanPriceAtom)?.amount ?? 0);

export const paymentIntentAtom = atom<PaymentIntent | null>(null);

export const couponIDAtom = atom<string | null>(null);
