/* eslint-disable react/display-name, import/prefer-default-export */
import React from 'react';
import { Elements, StripeProvider, injectStripe } from 'react-stripe-elements';
import { setDisplayName, wrapDisplayName } from 'recompose';

import { STRIPE_KEY } from '@/config';
import { delay } from '@/utils/promise';

import { withExternalResources } from './withExternalResources';

const MAX_POLL_COUNT = 30;
const POLL_INTERVAL = 1000;

const STRIPE_CUSTOM_FONTS = [
  {
    cssSrc: 'https://fonts.googleapis.com/css?family=Open+Sans:400',
  },
];

export const withStripe = (Component) => {
  const StripeWrappedComponent = injectStripe(Component);

  return withExternalResources({ resources: [{ type: 'script', path: 'https://js.stripe.com/v3/' }] })(
    setDisplayName(wrapDisplayName(Component, 'withStripe'))(
      React.forwardRef((props, ref) => {
        const [stripe, setStripe] = React.useState(window.stripe);

        React.useEffect(() => {
          if (!stripe) {
            window.stripe = window.Stripe(STRIPE_KEY);
            setStripe(window.stripe);
          }
        }, []);

        const checkChargeable = React.useCallback(
          async ({ id, client_secret: clientSecret }) => {
            let pollCount = 0;

            const pollForSourceStatus = async () => {
              const { source } = await stripe.retrieveSource({ id, client_secret: clientSecret });

              // Depending on the Charge status, show your customer the relevant message.
              if (source.status === 'chargeable') {
                return true;
              }

              if (source.status === 'pending' && pollCount < MAX_POLL_COUNT) {
                // Try again in a second, if the Source is still `pending`:
                pollCount += 1;

                await delay(POLL_INTERVAL);

                return pollForSourceStatus();
              }

              throw new Error('Payment not valid - unable to verify card');
            };

            return pollForSourceStatus();
          },
          [stripe]
        );

        if (!stripe) {
          return null;
        }

        return (
          <StripeProvider stripe={stripe}>
            <Elements fonts={STRIPE_CUSTOM_FONTS}>
              <StripeWrappedComponent {...props} ref={ref} stripe={stripe} checkChargeable={checkChargeable} />
            </Elements>
          </StripeProvider>
        );
      })
    )
  );
};
