import React from 'react';

import { withStripe } from '@/hocs';

import CardElement from '.';

const CardWithStripe = withStripe(CardElement);

export default {
  title: 'Stripe/CardElement',
  component: CardElement,
  includeStories: [],
};

export const normal = () => (
  <div style={{ width: '470px' }}>
    <CardWithStripe />
  </div>
);
