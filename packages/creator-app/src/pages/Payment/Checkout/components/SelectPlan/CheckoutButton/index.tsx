import { Button, ButtonVariant, SvgIcon } from '@voiceflow/ui';
import _isEmpty from 'lodash/isEmpty';
import React from 'react';

import { PaymentContextProps, withPayment } from '@/pages/Payment/context';
import { Identifier } from '@/styles/constants';
import { onOpenBookDemoPage } from '@/utils/upgrade';

import { CostText, LoadingButton } from './components';

interface CheckoutButtonProps {
  payment: PaymentContextProps;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ payment: { state, checkout } }) => {
  const { totalPrice, errors, stripeCompleted, loading, usingExistingSource, upgradePrompt } = state;

  if (loading.checkout) {
    return (
      <LoadingButton variant={ButtonVariant.PRIMARY} square>
        <SvgIcon icon="arrowSpin" size={24} spin />
      </LoadingButton>
    );
  }

  const paymentReady = stripeCompleted || usingExistingSource;
  const disabled = totalPrice === 0 || (!upgradePrompt && (!_isEmpty(errors) || !paymentReady));

  return (
    <Button
      id={Identifier.PAYMENT_UPGRADE_BUTTON}
      variant={ButtonVariant.PRIMARY}
      onClick={upgradePrompt ? onOpenBookDemoPage : checkout}
      disabled={disabled}
    >
      {upgradePrompt ? (
        <div>Upgrade to Enterprise</div>
      ) : (
        <div>
          Upgrade{' '}
          {paymentReady && (
            <CostText>
              and Pay
              {!loading.price && totalPrice ? ` $${totalPrice}` : ''}
            </CostText>
          )}
        </div>
      )}
    </Button>
  );
};

export default withPayment(CheckoutButton);
