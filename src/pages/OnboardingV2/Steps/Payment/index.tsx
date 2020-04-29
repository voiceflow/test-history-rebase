import throttle from 'lodash/throttle';
import React, { useContext } from 'react';

import client from '@/client';
import Button from '@/components/Button';
import Collapsable from '@/components/Collapsable';
import Dropdown from '@/components/Dropdown';
import { FlexApart, FlexCenter } from '@/components/Flex';
import { ControlledInput } from '@/components/Input';
import { CardElement } from '@/components/Stripe';
import SvgIcon from '@/components/SvgIcon';
import { ClickableText } from '@/components/Text';
import { BillingPeriod, PERIOD_NAME } from '@/constants';
import { useToggle } from '@/hooks';
import { OnboardingContext } from '@/pages/OnboardingV2/context';
import { OnboardingProps } from '@/pages/OnboardingV2/types';
import BillingDropdown from '@/pages/Payment/Checkout/components/SeatsAndBilling/components/BillingDropdown';

import {
  BubbleTextContainer,
  Container,
  CostTimeUnit,
  CouponText,
  DollarSymbol,
  EditorSeatsText,
  InfoBubble,
  PaymentDetailsContainer,
  PaymentDetailsText,
  PeriodDropdownContainer,
  PriceAmount,
  PriceContainer,
  SubHeader,
} from './components';

const DropdownComponent: any = Dropdown;
const PeriodDropdown: any = BillingDropdown;

const Payment: React.FC<OnboardingProps> = () => {
  const { state, actions } = useContext(OnboardingContext);
  const { plan, couponCode, period } = state.paymentMeta;
  const { collaborators } = state.addCollaboratorMeta;

  const numberOfSeats = collaborators.length;

  const [usingCoupon, toggleCoupon] = useToggle(false);
  const [coupon, setCoupon] = React.useState(couponCode || '');
  const [paymentPeriod, setPaymentPeriod] = React.useState(period);
  const [couponError, setCouponError] = React.useState('');
  const [price, setPrice] = React.useState('--');
  const [priceError, setPriceError] = React.useState('');
  const [creditCardError, setCreditCardError] = React.useState('');
  const [creditCardComplete, setCreditCardComplete] = React.useState(false);

  const canContinue = !creditCardError && !couponError && creditCardComplete && !priceError;
  const onContinue = async () => {
    actions.setPaymentMeta({
      ...state.paymentMeta,
      couponCode: coupon,
      period: paymentPeriod,
    });

    actions.finishCreateOnboarding();
  };
  const verifyCoupon = () => {
    throttle(async () => {
      const data = (await client.workspace.checkCoupon(coupon)).data;
      setCouponError(data);
    }, 1000);
  };

  const handleStripeOnChange = ({ error }: any) => {
    setCreditCardError(error);
  };

  const getPrice = async () => {
    const { price, errors }: any = await client.workspace.calculatePrice(null, {
      plan: plan!,
      seats: numberOfSeats,
      period: paymentPeriod,
      coupon: coupon || undefined,
    });

    setPrice(price);
    setPriceError(errors);
  };

  React.useEffect(() => {
    getPrice();
  }, [coupon, paymentPeriod]);

  return (
    <Container>
      <SubHeader>voiceflow {plan} plan</SubHeader>
      <InfoBubble>
        <SvgIcon icon="teamGroup" size={64} />
        <BubbleTextContainer column>
          <EditorSeatsText>{numberOfSeats} Editor Seats</EditorSeatsText>
          <PeriodDropdownContainer>
            <DropdownComponent
              options={[
                {
                  label: 'Monthly',
                  onClick: () => setPaymentPeriod(BillingPeriod.MONTHLY),
                },
                {
                  label: 'Annual',
                  onClick: () => setPaymentPeriod(BillingPeriod.ANNUALLY),
                },
              ]}
              placement="bottom-start"
            >
              {(ref: React.Ref<any>, onToggle: any, isOpen: boolean) => (
                <PeriodDropdown ref={ref} onClick={onToggle} isOpen={isOpen}>
                  Billed {PERIOD_NAME[paymentPeriod]}
                  <SvgIcon icon="caretDown" color={isOpen ? '5D9DF5' : ''} size={7} />
                </PeriodDropdown>
              )}
            </DropdownComponent>
          </PeriodDropdownContainer>
        </BubbleTextContainer>
        <PriceContainer>
          <DollarSymbol>$</DollarSymbol>
          <PriceAmount>{price}</PriceAmount>
          <CostTimeUnit>/ month</CostTimeUnit>
        </PriceContainer>
      </InfoBubble>
      <PaymentDetailsContainer>
        <FlexApart>
          <PaymentDetailsText>Payment Details</PaymentDetailsText>
          <ClickableText onClick={toggleCoupon}>
            <CouponText>I have a coupon</CouponText>
          </ClickableText>
        </FlexApart>
        <Collapsable opened={usingCoupon}>
          <ControlledInput
            maxLength={16}
            placeholder="Coupon code"
            value={coupon}
            onChange={(e: any) => {
              setCoupon(e.target.value);
              verifyCoupon();
            }}
            error={!!couponError}
            complete={!couponError && !!coupon}
            message={couponError}
          />
        </Collapsable>
        <CardElement onChangeComplete={setCreditCardComplete} stripeOnChange={handleStripeOnChange} />
      </PaymentDetailsContainer>

      <FlexCenter>
        <Button disabled={!canContinue} variant="primary" onClick={onContinue}>
          Pay ${price}
        </Button>
      </FlexCenter>
    </Container>
  );
};

export default Payment;
