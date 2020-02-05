import React from 'react';

import Collapsable from '@/componentsV2/Collapsable';
import Input, { ControlledInput } from '@/componentsV2/Input';
import { CardElement } from '@/componentsV2/Stripe';
import StepSection from '@/containers/Payment/components/Section';
import { withPayment } from '@/containers/Payment/context';

import StepHeading from '../StepHeading';

const generateDiscountMessage = (discount) => {
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

function PaymentDetails({
  payment: {
    state: { coupon, usingCoupon, errors, discount, usingExistingSource, source },
    actions: { setCoupon, toggleUsingCoupon, setStripeCompleted, toggleUsingExistingSource },
  },
}) {
  const couponError = errors?.coupon?.message;
  const actions = [];
  if (source) actions.push({ label: usingExistingSource ? 'Update card' : 'Use existing card', action: toggleUsingExistingSource });
  else {
    actions.push({ label: usingCoupon ? 'Cancel coupon' : 'I have a coupon', action: toggleUsingCoupon });
  }

  return (
    <>
      <StepHeading heading="3. Payment details" actions={actions} />
      <StepSection>
        <Collapsable opened={usingCoupon}>
          <ControlledInput
            maxLength={16}
            placeholder="Coupon code"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            error={couponError}
            complete={!couponError && discount?.message}
            message={couponError || generateDiscountMessage(discount)}
          />
        </Collapsable>
        {usingExistingSource && source ? (
          <Input icon="creditCard" value={`${source.brand} | XXXX-XXXX-XXXX-${source.last4}`} disabled />
        ) : (
          <CardElement onChangeComplete={setStripeCompleted} />
        )}
      </StepSection>
    </>
  );
}

export default withPayment(PaymentDetails);
