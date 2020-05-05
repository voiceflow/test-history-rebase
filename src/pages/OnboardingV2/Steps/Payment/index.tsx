import { isEmpty } from 'lodash';
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
import { BillingPeriod, PERIOD_NAME, PLANS } from '@/constants';
import { useDebouncedCallback, useToggle } from '@/hooks';
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

export const GET_PRICE_WITHOUT_TEAM_ID_CONST = 'none';

const DropdownComponent: any = Dropdown;
const PeriodDropdown: any = BillingDropdown;

const Payment: React.FC<OnboardingProps> = () => {
  const { state, actions } = useContext(OnboardingContext);
  const { plan, couponCode, period } = state.paymentMeta;
  const { sendingRequests } = state;
  const { collaborators } = state.addCollaboratorMeta;

  const numberOfSeats = collaborators.length;

  const [usingCoupon, toggleCoupon] = useToggle(!!couponCode);
  const [coupon, setCoupon] = React.useState(couponCode || '');
  const [paymentPeriod, setPaymentPeriod] = React.useState(period);
  const [couponError, setCouponError] = React.useState('');
  const [price, setPrice] = React.useState(0);
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

    actions.stepForward(null);
    actions.finishCreateOnboarding();
  };

  const handleStripeOnChange = ({ error }: any) => {
    setCreditCardError(error);
  };

  const getPrice = useDebouncedCallback(
    500,
    async (plan: PLANS, numberOfSeats: number, paymentPeriod: BillingPeriod, coupon: string) => {
      const { price, errors } = await client.workspace.calculatePrice(GET_PRICE_WITHOUT_TEAM_ID_CONST, {
        plan: plan!,
        seats: numberOfSeats,
        period: paymentPeriod,
        coupon: coupon || undefined,
      });

      if (isEmpty(errors)) {
        setPrice(price);
        setCouponError('');
      } else {
        setCouponError(errors.coupon?.message || '');
      }
    },
    [setPrice, setCouponError, setPriceError, setCouponError]
  );

  React.useEffect(() => {
    getPrice(plan, numberOfSeats, paymentPeriod, coupon);
  }, [coupon, paymentPeriod, plan, numberOfSeats, setCouponError, setPriceError]);

  const dollarPrice = price / 100;

  return (
    <Container>
      <SubHeader>voiceflow {plan} plan</SubHeader>
      <InfoBubble>
        <img src="/images/team-group.svg" alt="team" height={64} />
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
          <PriceAmount>{dollarPrice}</PriceAmount>
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
            }}
            error={!!couponError}
            complete={!couponError && !!coupon}
            message={couponError}
          />
        </Collapsable>
        <CardElement onChangeComplete={setCreditCardComplete} stripeOnChange={handleStripeOnChange} />
      </PaymentDetailsContainer>

      <FlexCenter>
        <Button disabled={!canContinue || sendingRequests} variant="primary" onClick={onContinue}>
          {sendingRequests ? <SvgIcon icon="publishSpin" size={24} spin /> : <>Pay ${dollarPrice}</>}
        </Button>
      </FlexCenter>
    </Container>
  );
};

export default Payment;
