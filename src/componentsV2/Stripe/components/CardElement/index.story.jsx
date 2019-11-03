import { storiesOf } from '@storybook/react';
import React from 'react';

import { Variant, createTestableStory } from '@/../.storybook';
import { withStripe } from '@/hocs';

import CardElement from '.';

storiesOf('Stripe/CardElement', module).add(
  'variants',
  createTestableStory(() => {
    return (
      <Variant label="basic">
        <div style={{ width: '470px' }}>
          <CardElement />
        </div>
      </Variant>
    );
  }, withStripe)
);
