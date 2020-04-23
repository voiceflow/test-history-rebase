import _isEmpty from 'lodash/isEmpty';
import React from 'react';

import Button from '@/components/Button';
import Icon from '@/components/SvgIcon';
import { BillingPeriod } from '@/constants';
import { styled } from '@/hocs';
import StartAChatButton from '@/pages/Payment/components/StartAChatButton';
import { withPayment } from '@/pages/Payment/context';

const LoadingButton = styled(Button)`
  cursor: auto;
  pointer-events: none;
`;

function CheckoutButton({
  payment: {
    state: { price, period, hasPricing, errors, stripeCompleted, loading, usingExistingSource },
    checkout,
  },
}) {
  let checkoutButton;
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
      <Button variant="primary" onClick={checkout} disabled={!_isEmpty(errors) || !(stripeCompleted || usingExistingSource)}>
        Upgrade and Pay{!loading.price && price ? ` $${period === BillingPeriod.MONTHLY ? price : 12 * price}` : ''}
      </Button>
    );
  }

  return checkoutButton;
}

export default withPayment(CheckoutButton);
