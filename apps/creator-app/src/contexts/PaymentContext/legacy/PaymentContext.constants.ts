import type { StripeElementsOptions } from '@stripe/stripe-js';

export const MAX_POLL_COUNT = 30;
export const POLL_INTERVAL = 1000;

export const STRIPE_ELEMENT_OPTIONS: StripeElementsOptions = {
  fonts: [
    {
      cssSrc: 'https://fonts.googleapis.com/css?family=Open+Sans:400',
    },
  ],
  appearance: {
    variables: {
      fontFamily: 'Open Sans, sans-serif',
      borderRadius: '6px',
      colorTextPlaceholder: '#8DA2B5',
    },
  },
};
