import _isEmpty from 'lodash/isEmpty';
import React from 'react';

import Icon from '@/components/SvgIcon';
import Button from '@/componentsV2/Button';
import { PERIOD } from '@/constants';
import StartAChatButton from '@/containers/Payment/components/StartAChatButton';
import { withPayment } from '@/containers/Payment/context';
import { styled } from '@/hocs';

const LoadingButton = styled(Button)`
  curosr: auto;
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
        Upgrade and Pay{!loading.price && price ? ` $${period === PERIOD.monthly ? price : 12 * price}` : ''}
      </Button>
    );
  }

  return checkoutButton;
}

export default withPayment(CheckoutButton);
