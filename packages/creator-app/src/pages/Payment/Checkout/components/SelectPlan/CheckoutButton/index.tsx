import { BillingPeriod } from '@voiceflow/internal';
import { Button, ButtonVariant, SvgIcon } from '@voiceflow/ui';
import _isEmpty from 'lodash/isEmpty';
import React from 'react';

import { useTrackingEvents } from '@/hooks';
import StartAChatButton from '@/pages/Payment/components/StartAChatButton';
import { PaymentContextProps, withPayment } from '@/pages/Payment/context';
import { Identifier } from '@/styles/constants';

import { CostText, LoadingButton } from './components';

interface CheckoutButtonProps {
  payment: PaymentContextProps;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ payment: { state, checkout } }) => {
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
      <LoadingButton variant={ButtonVariant.PRIMARY} square>
        <SvgIcon icon="publishSpin" size={24} spin />
      </LoadingButton>
    );
  }

  const paymentReady = stripeCompleted || usingExistingSource;

  return (
    <Button
      id={Identifier.PAYMENT_UPGRADE_BUTTON}
      variant={ButtonVariant.PRIMARY}
      onClick={onUpgradeClick}
      disabled={!_isEmpty(errors) || !paymentReady}
    >
      Upgrade{' '}
      {paymentReady && (
        <CostText>
          and Pay
          {!loading.price && price ? ` $${period === BillingPeriod.MONTHLY ? price : 12 * price}` : ''}
        </CostText>
      )}
    </Button>
  );
};

export default withPayment(CheckoutButton);
