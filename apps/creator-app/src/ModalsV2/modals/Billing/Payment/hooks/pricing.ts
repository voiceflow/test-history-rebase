import { BillingPeriod } from '@voiceflow/internal';
import { useAtom, useAtomValue } from 'jotai';

import * as atoms from '../Payment.atoms';

export const usePricing = () => {
  const editorSeats = useAtomValue(atoms.editorSeatsAtom);
  const [period, setPeriod] = useAtom(atoms.periodAtom);
  const activePaidPlanPrices = useAtomValue(atoms.activePaidPlanPricesAtom);

  const periodPrice = (activePaidPlanPrices?.[period].amount ?? 0) * (period === BillingPeriod.ANNUALLY ? 12 : 1);
  const price = periodPrice * editorSeats;

  const onChangePeriod = (period: BillingPeriod) => setPeriod(period);

  return {
    period,
    price,
    prices: Object.entries(activePaidPlanPrices || {})?.reduce<Record<BillingPeriod, number>>(
      (acc, [period, price]) => ({ ...acc, [period]: price.amount }),
      {
        [BillingPeriod.ANNUALLY]: 0,
        [BillingPeriod.MONTHLY]: 0,
      }
    ),
    periodPrice,
    hasCard: false,
    onChangePeriod,
  };
};
