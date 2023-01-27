import { Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe, Source } from '@stripe/stripe-js';
import { Utils } from '@voiceflow/common';
import { useContextApi, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import { STRIPE_KEY } from '@/config';

const MAX_POLL_COUNT = 30;
const POLL_INTERVAL = 1000;

const stripePromise = loadStripe(STRIPE_KEY);

export interface PaymentAPIContextType {
  checkChargeable: (source: Pick<Source, 'id' | 'client_secret'>) => Promise<boolean>;
  createSource: () => Promise<Source>;
}

export const PaymentAPIContext = React.createContext<PaymentAPIContextType | null>(null);

export const PaymentApiProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const stripe = useStripe();
  const elements = useElements();

  // eslint-disable-next-line camelcase
  const checkChargeable = usePersistFunction(async ({ id, client_secret }: Pick<Source, 'id' | 'client_secret'>) => {
    let pollCount = 0;

    const pollForSourceStatus = async (): Promise<boolean> => {
      if (!stripe) throw new Error('Stripe not initialized');

      // eslint-disable-next-line camelcase
      const { source } = await stripe.retrieveSource({ id, client_secret });

      if (!source) {
        throw new Error('Payment not valid - unable to verify card');
      }

      if (source.status === 'chargeable') return true;
      if (source.status === 'pending' && pollCount < MAX_POLL_COUNT) {
        // Try again in a second, if the Source is still `pending`:
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

  const api = useContextApi({
    checkChargeable,
    createSource,
  });

  if (!stripe) return null;

  return <PaymentAPIContext.Provider value={api}>{children}</PaymentAPIContext.Provider>;
};

export const StripeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <Elements stripe={stripePromise}>{children}</Elements>;
};

export const PaymentProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <StripeProvider>
      <PaymentApiProvider>{children}</PaymentApiProvider>
    </StripeProvider>
  );
};

export const usePaymentAPI = () => {
  const paymentAPI = React.useContext(PaymentAPIContext);

  if (!paymentAPI) {
    throw new Error('Payment API is not available');
  }

  return paymentAPI;
};

export const withPayment = (Component: any) =>
  React.forwardRef((props, ref) => (
    <PaymentProvider>
      <Component {...props} ref={ref} />
    </PaymentProvider>
  ));
