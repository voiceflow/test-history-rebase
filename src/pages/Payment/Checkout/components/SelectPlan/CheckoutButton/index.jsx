import _isEmpty from 'lodash/isEmpty';
import React from 'react';

import Button from '@/components/Button';
import Icon from '@/components/SvgIcon';
import { BillingPeriod } from '@/constants';
import { useTrackingEvents } from '@/hooks';
import StartAChatButton from '@/pages/Payment/components/StartAChatButton';
import { withPayment } from '@/pages/Payment/context';

import { CostText, LoadingButton } from './components';

function CheckoutButton({ payment: { state, checkout } }) {
  const { plan, seats, coupon, price, period, hasPricing, errors, stripeCompleted, loading, usingExistingSource } = state;

  const [trackingEvents] = useTrackingEvents();

  const onUpgradeClick = () => {
    trackingEvents.trackUpgrade({
      plan: plan.id,
      seats: +seats,
      period,
      coupon,
    });

    checkout();
  };

  if (!hasPricing) {
    return <StartAChatButton />;
  }

  if (loading.checkout) {
    return (
      <LoadingButton variant="primary" square>
        <Icon icon="publishSpin" size={24} spin />
      </LoadingButton>
    );
  }

  const paymentReady = stripeCompleted || usingExistingSource;

  return (
    <Button variant="primary" onClick={onUpgradeClick} disabled={!_isEmpty(errors) || !paymentReady}>
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

export default withPayment(CheckoutButton);
