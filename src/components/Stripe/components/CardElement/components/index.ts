export { default as StripeCardElementWrapper } from './StripeCardElementWrapper';
export { default as Wrapper } from './Wrapper';

export const stripeInputStyle = {
  base: {
    fontSize: '15px',
    fontWeight: '400',
    fontFamily: "'Open Sans', sans-serif",
    color: '#132144',
    fontSmoothing: 'antialiased',

    '::placeholder': {
      color: '#8da2b5',
      fontWeight: '400',
    },
  },
  invalid: {
    color: '#132144',

    '::placeholder': {
      color: '#8da2b5',
    },
  },
};
