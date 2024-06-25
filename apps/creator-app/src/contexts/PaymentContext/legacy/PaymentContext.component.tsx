import { Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import type { Source, SourceCreateParams } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { isNetworkError, toast, useAsyncEffect, useContextApi, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import { STRIPE_KEY } from '@/config';
import { PlanPricesContext } from '@/contexts/PlanPricesContext';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector, useSyncDispatch } from '@/hooks';
import type { DBPaymentSource, PlanSubscription } from '@/models';

import { MAX_POLL_COUNT, POLL_INTERVAL, STRIPE_ELEMENT_OPTIONS } from './PaymentContext.constants';
import type { CardHolderInfo, PaymentAPIContextType } from './PaymentContext.types';

const stripePromise = loadStripe(STRIPE_KEY);

export const PaymentAPIContext = React.createContext<PaymentAPIContextType | null>(null);

export const PaymentApiProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const platPrices = React.useContext(PlanPricesContext);

  const [isReady, setIsReady] = React.useState(false);
  const [paymentSource, setPaymentSource] = React.useState<DBPaymentSource | null>(null);
  const [planSubscription, setPlanSubscription] = React.useState<PlanSubscription | null>(null);

  const isFree = !useSelector(WorkspaceV2.active.isOnPaidPlanSelector);
  const workspace = useSelector(WorkspaceV2.active.workspaceSelector);
  const isEnterprise = useSelector(WorkspaceV2.active.isEnterpriseSelector);
  const isTrial = useSelector(WorkspaceV2.active.isOnTrialSelector);

  const changeSeats = useSyncDispatch(Realtime.workspace.changeSeats);

  const stripe = useStripe();
  const elements = useElements();

  const checkChargeable = usePersistFunction(
    async ({ id, client_secret: clientSecret }: Pick<Source, 'id' | 'client_secret'>) => {
      let pollCount = 0;

      const pollForSourceStatus = async (): Promise<boolean> => {
        if (!stripe) throw new Error('Stripe not initialized');

        const { source } = await stripe.retrieveSource({ id, client_secret: clientSecret });

        if (!source) {
          throw new Error('Payment not valid - unable to verify card');
        }

        if (source.status === 'chargeable') return true;

        // Try again in a second, if the Source is still `pending`:
        if (source.status === 'pending' && pollCount < MAX_POLL_COUNT) {
          pollCount += 1;

          await Utils.promise.delay(POLL_INTERVAL);

          return pollForSourceStatus();
        }

        throw new Error('Payment not valid - unable to verify card');
      };

      return pollForSourceStatus();
    }
  );

  const createSource = usePersistFunction(async (): Promise<Source> => {
    if (!stripe || !elements) throw new Error('Stripe not loaded');

    const cardElement = elements.getElement('card');

    if (!cardElement) throw new Error('Card Element not found');

    const stripeSource = await stripe.createSource(cardElement, { type: 'card' });

    if (!stripeSource.source) {
      throw new Error(stripeSource.error?.message || 'Invalid Card Information');
    }

    await checkChargeable(stripeSource.source);
    return stripeSource.source;
  });

  const updateWorkspaceSource = usePersistFunction(async (source: Source) => {
    if (!workspace) return;

    await client.workspace.updateSource(workspace.id, source.id);
  });

  const createFullSource = usePersistFunction(async (cardHolderInfo: CardHolderInfo): Promise<Source> => {
    if (!stripe || !elements) throw new Error('Stripe not loaded');

    const cardElement = elements.getElement('card');

    if (!cardElement) throw new Error('Card Element not found');

    const owner: SourceCreateParams.Owner = {
      name: cardHolderInfo.name,
      address: {
        city: cardHolderInfo.city,
        line1: cardHolderInfo.address,
        state: cardHolderInfo.state,
        country: cardHolderInfo.country,
      },
    };

    const stripeSource = await stripe.createSource(cardElement, { type: 'card', owner });

    if (!stripeSource.source) {
      throw new Error(stripeSource.error?.message || 'Invalid Card Information');
    }

    await checkChargeable(stripeSource.source);

    return stripeSource.source;
  });

  const fetchPaymentSource = usePersistFunction(async () => {
    if (isFree || isTrial || isEnterprise || !workspace) return;

    const plan = await client.workspace.getPlan(workspace.id);

    setPaymentSource(plan.source ?? null);
  });

  const fetchPlanSubscription = usePersistFunction(async () => {
    if (isFree || isTrial || isEnterprise || !workspace) return;

    const newPlanSubscription = await client.workspace.getPlanSubscription(workspace.id);

    setPlanSubscription(newPlanSubscription);
  });

  const updatePlanSubscriptionSeats = usePersistFunction(async (seats: number) => {
    if (!workspace) return;

    await changeSeats({ seats, schedule: false, workspaceID: workspace.id });
  });

  useAsyncEffect(async () => {
    setIsReady(false);
    setPaymentSource(null);
    setPlanSubscription(null);

    try {
      const results = await Promise.allSettled([fetchPlanSubscription(), fetchPaymentSource(), platPrices.get()]);

      if (
        results.some(
          (result) => result.status === 'rejected' && isNetworkError(result.reason) && result.reason.statusCode !== 404
        )
      ) {
        toast.error('Something went wrong. Please try again later.');
      }
    } finally {
      setIsReady(true);
    }
  }, [workspace?.id, workspace?.plan, workspace?.seats]);

  const api = useContextApi({
    isReady,
    createSource,
    paymentSource,
    checkChargeable,
    createFullSource,
    planSubscription,
    refetchPaymentSource: fetchPaymentSource,
    updateWorkspaceSource,
    refetchPlanSubscription: fetchPlanSubscription,
    updatePlanSubscriptionSeats,
  });

  if (!stripe) return null;

  return <PaymentAPIContext.Provider value={api}>{children}</PaymentAPIContext.Provider>;
};

export const StripeProvider: React.FC<React.PropsWithChildren> = ({ children }) => (
  <Elements stripe={stripePromise} options={STRIPE_ELEMENT_OPTIONS}>
    {children}
  </Elements>
);

export const PaymentProvider: React.FC<React.PropsWithChildren> = ({ children }) => (
  <StripeProvider>
    <PaymentApiProvider>{children}</PaymentApiProvider>
  </StripeProvider>
);
