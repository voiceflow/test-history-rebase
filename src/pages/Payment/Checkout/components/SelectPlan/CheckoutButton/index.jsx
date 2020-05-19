import _isEmpty from 'lodash/isEmpty';
import React from 'react';

import Button from '@/components/Button';
import Icon from '@/components/SvgIcon';
import { BillingPeriod } from '@/constants';
import StartAChatButton from '@/pages/Payment/components/StartAChatButton';
import { withPayment } from '@/pages/Payment/context';

import { CostText, LoadingButton } from './components';

function CheckoutButton({
  payment: {
    state: { price, period, hasPricing, errors, stripeCompleted, loading, usingExistingSource },
    checkout,
  },
}) {
  let checkoutButton;
  const paymentReady = stripeCompleted || usingExistingSource;
  if (!hasPricing) {
    checkoutButton = <StartAChatButton />;
  } else if (loading.checkout) {
    checkoutButton = (
      <LoadingButton variant="primary" square>
        <Icon icon="publishSpin" size={24} spin />
      </LoadingButton>
    );
  } else {
    checkoutButton = (
      <Button variant="primary" onClick={checkout} disabled={!_isEmpty(errors) || !paymentReady}>
        Upgrade{' '}
        {paymentReady && (
          <CostText>
            and Pay
            {!loading.price && price ? ` $${period === BillingPeriod.MONTHLY ? price : 12 * price}` : ''}
          </CostText>
        )}
      </Button>
    );
  }

  return checkoutButton;
}

export default withPayment(CheckoutButton);
