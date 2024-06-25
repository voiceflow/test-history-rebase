import { Utils } from '@voiceflow/common';
import type { BillingPeriod, PlanType } from '@voiceflow/internal';
import { useContextApi } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as Account from '@/ducks/account';
import { useSelector } from '@/hooks/redux';

type PlanPricesMap = Partial<Record<PlanType, Record<BillingPeriod, number> | null>>;

export interface PlanPricesContext {
  map: PlanPricesMap;
  get: () => Promise<PlanPricesMap>;
}

export const PlanPricesContext = React.createContext<PlanPricesContext>({
  map: {},
  get: () => Promise.resolve({}),
});

export const PlanPricesProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [map, setMap] = React.useState<PlanPricesMap>({});

  const isLoggedIn = useSelector(Account.isLoggedInSelector);

  const get = React.useCallback(async () => {
    const plans = await client.workspace.getPlans();

    const visiblePlans = plans.filter(({ legacy, hidden, pricing }) => !legacy && !hidden && !!pricing);

    const prices = Object.fromEntries(
      visiblePlans.map((plan) => [
        plan.id,
        plan.pricing
          ? Object.fromEntries(Object.entries(plan.pricing).map(([key, { price }]) => [key, price / 100]))
          : null,
      ])
    ) as PlanPricesMap;

    setMap(prices);

    return prices;
  }, []);

  React.useEffect(() => {
    if (!isLoggedIn) return;

    get().catch(Utils.functional.noop);
  }, [isLoggedIn]);

  const api = useContextApi({ map, get });

  return <PlanPricesContext.Provider value={api}>{children}</PlanPricesContext.Provider>;
};
