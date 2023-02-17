import { Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe, Source, SourceCreateParams } from '@stripe/stripe-js';
import { Utils } from '@voiceflow/common';
import { toast, useAsyncEffect, useContextApi, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import { STRIPE_KEY } from '@/config';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';
import { DBPaymentSource, DBPlan, PlanSubscription } from '@/models';

import { MAX_POLL_COUNT, POLL_INTERVAL, STRIPE_ELEMENT_OPTIONS } from './constants';
import { CardHolderInfo, PaymentAPIContextType } from './types';

export * from './types';

const stripePromise = loadStripe(STRIPE_KEY);

export const PaymentAPIContext = React.createContext<PaymentAPIContextType | null>(null);

export const PaymentApiProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isReady, setIsReady] = React.useState(false);
  const [paymentSource, setPaymentSource] = React.useState<DBPaymentSource | null>(null);
  const [planSubscription, setPlanSubscription] = React.useState<PlanSubscription | null>(null);
  const [plans, setPlans] = React.useState<DBPlan[]>([]);
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector)!;
  const stripe = useStripe();
  const elements = useElements();

  const checkChargeable = usePersistFunction(async ({ id, client_secret: clientSecret }: Pick<Source, 'id' | 'client_secret'>) => {
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
  });

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
    await client.workspace.updateSource(workspaceID, source.id);
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

  const fetchPaymentSource = async () => {
    const plan = await client.workspace.getPlan(workspaceID);
    setPaymentSource(plan.source ?? null);
  };

  const fetchPlanSubscription = async () => {
    const newPlanSubscription = await client.workspace.getPlanSubscription(workspaceID);
    setPlanSubscription(newPlanSubscription);
  };

  const fetchPlans = async () => {
    const plans = await client.workspace.getPlans();
    setPlans(plans.filter(({ pricing, hidden, legacy }) => !!pricing && !legacy && !hidden));
  };

  useAsyncEffect(async () => {
    setIsReady(false);
    setPlanSubscription(null);
    setPaymentSource(null);
    setPlans([]);

    try {
      await fetchPaymentSource();
    } catch {
      // skip
    }

    Promise.allSettled([fetchPlanSubscription(), fetchPaymentSource(), fetchPlans()])
      .then(() => setIsReady(true))
      .catch((error) => {
        setIsReady(true);
        if (error.statusCode !== 404) {
          toast.error('Something went wrong. Please try again later.');
        }
      });
  }, [workspaceID]);

  const updatePlanSubscriptionSeats = usePersistFunction(async (seats: number) => {
    await client.workspace.updatePlanSubscriptionSeats(workspaceID, { seats, schedule: false });
  });

  const api = useContextApi({
    isReady,
    createSource,
    paymentSource,
    plans,
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

export const usePaymentAPI = () => {
  const paymentAPI = React.useContext(PaymentAPIContext);

  if (!paymentAPI) {
    throw new Error('Payment API is not available');
  }

  return paymentAPI;
};
