import { BillingPeriod } from '@voiceflow/internal';
import { Button, ButtonVariant, SvgIcon } from '@voiceflow/ui';
import _isEmpty from 'lodash/isEmpty';
import React from 'react';

import StartAChatButton from '@/pages/Payment/components/StartAChatButton';
import { PaymentContextProps, withPayment } from '@/pages/Payment/context';
import { Identifier } from '@/styles/constants';

import { CostText, LoadingButton } from './components';

interface CheckoutButtonProps {
  payment: PaymentContextProps;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ payment: { state, checkout } }) => {
  const { price, period, hasPricing, errors, stripeCompleted, loading, usingExistingSource } = state;

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
    <Button id={Identifier.PAYMENT_UPGRADE_BUTTON} variant={ButtonVariant.PRIMARY} onClick={checkout} disabled={!_isEmpty(errors) || !paymentReady}>
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
