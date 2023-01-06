import { ControlledInput, Input } from '@voiceflow/ui';
import React from 'react';

import Collapsable from '@/components/Collapsable';
import { CardElement } from '@/components/Stripe';
import StepSection from '@/pages/Payment/components/Section';
import { PaymentContextProps, PaymentDiscount, withPayment } from '@/pages/Payment/context';
import { Identifier } from '@/styles/constants';

import StepHeading from '../StepHeading';

const generateDiscountMessage = (discount?: PaymentDiscount) => {
  if (!discount) return;

  const { message, type, value } = discount;
  if (type === 'percentage') {
    return `${message} | ${value * 100}% off`;
  }
  if (type === 'amount') {
    return `${message} | $${Math.floor(value / 100)} off`;
  }
  return message;
};

interface PaymentDetailsProps {
  payment: PaymentContextProps;
}

const PaymentDetails: React.OldFC<PaymentDetailsProps> = ({
  payment: {
    state: { coupon, usingCoupon, errors, discount, usingExistingSource, source, upgradePrompt },
    actions: { setCoupon, toggleUsingCoupon, setStripeCompleted, toggleUsingExistingSource },
  },
}) => {
  const couponError = errors?.coupon?.message;
  const actions = [];
  if (source) actions.push({ label: usingExistingSource ? 'Update card' : 'Use existing card', action: toggleUsingExistingSource });
  else {
    actions.push({ label: usingCoupon ? 'Cancel coupon' : 'I have a coupon', action: toggleUsingCoupon });
  }

  return (
    <>
      <StepHeading heading="Payment details" actions={actions} noBottomPadding />
      <StepSection id={Identifier.PAYMENT_DETAILS_SECTION}>
        <Collapsable opened={usingCoupon}>
          <ControlledInput
            disabled={upgradePrompt}
            maxLength={16}
            placeholder="Coupon code"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            error={!!couponError}
            complete={!couponError && !!discount?.message}
            message={couponError || generateDiscountMessage(discount)}
          />
        </Collapsable>
        {usingExistingSource && source ? (
          <Input icon="creditCard" value={`${source.brand} | XXXX-XXXX-XXXX-${source.last4}`} disabled />
        ) : (
          <CardElement onChangeComplete={setStripeCompleted} disabled={upgradePrompt} />
        )}
      </StepSection>
    </>
  );
};

export default withPayment(PaymentDetails);
