import { BillingPeriod } from '@voiceflow/internal';
import { Dropdown, Flex, FlexApart, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import _isNumber from 'lodash/isNumber';
import React from 'react';

import { PERIOD_NAME } from '@/constants';
import StepSection from '@/pages/Payment/components/Section';
import { PaymentContextProps, PaymentErrors, withPayment } from '@/pages/Payment/context';
import { FadeLeftContainer } from '@/styles/animations';
import { Identifier } from '@/styles/constants';

import BillingDropdown from './components/BillingDropdown';
import DiscountMessageContainer from './components/DiscountMessageContainer';
import PriceBox from './components/PriceBox';
import SeatsBillingText from './components/SeatsBillingText';
import SeatsInput from './components/SeatsInput';

interface SeatsAndBillingProps {
  payment: PaymentContextProps;
}

const SeatsAndBilling: React.FC<SeatsAndBillingProps> = ({
  payment: {
    state: { plan, price, period, seats, errors, hasPricing, loading },
    actions: { setPeriod, setSeats },
  },
}) => {
  const formErrors: PaymentErrors = hasPricing ? errors : {};
  let discountMessage;

  if (plan?.pricing) {
    if (period === BillingPeriod.MONTHLY) {
      discountMessage = 'You could be saving 20% with annual billing';
    } else if (period === BillingPeriod.ANNUALLY) {
      discountMessage = (
        <span>
          You're <span style={{ color: '#279745' }}>saving 20%</span> with annual billing ✨
        </span>
      );
    }
  } else {
    discountMessage = '--';
  }

  const seatError = formErrors?.seats?.message;
  const periodError = formErrors?.period?.message;

  return (
    <>
      <StepSection secondary>
        <FlexApart>
          <Flex>
            <SeatsInput errorMessage={seatError} hasError={!!seatError} onChange={setSeats} value={seats} />
            <SeatsBillingText>
              <div>Editor Seats,</div>
              <Dropdown
                options={[
                  {
                    label: 'Monthly',
                    onClick: () => setPeriod(BillingPeriod.MONTHLY),
                  },
                  {
                    label: 'Annually',
                    onClick: () => setPeriod(BillingPeriod.ANNUALLY),
                  },
                ]}
                placement="bottom-start"
              >
                {(ref, onToggle, isOpen) => (
                  <TippyTooltip disabled={!periodError} title={periodError} position="top-start" theme="warning" distance={5}>
                    <BillingDropdown
                      id={Identifier.PAYMENT_MODAL_BILLING_CYCLE_DROPDOWN}
                      ref={ref}
                      onClick={onToggle}
                      error={!!periodError}
                      isOpen={isOpen}
                    >
                      Billed {PERIOD_NAME[period]}
                      <SvgIcon icon="caretDown" color={isOpen ? '5D9DF5' : ''} size={7} />
                    </BillingDropdown>
                  </TippyTooltip>
                )}
              </Dropdown>
            </SeatsBillingText>
          </Flex>
          <div>
            <PriceBox>
              <>
                <div>$</div>
                {!plan?.pricing || !_isNumber(price) || loading.price ? (
                  <div>&nbsp;--&nbsp;</div>
                ) : (
                  <div id={Identifier.PAYMENT_MODAL_UNIT_COST_CONTAINER}>{price}</div>
                )}
                <div>/ month</div>
              </>
            </PriceBox>
          </div>
        </FlexApart>
      </StepSection>
      <DiscountMessageContainer>
        <FadeLeftContainer key={period}>{discountMessage}</FadeLeftContainer>
      </DiscountMessageContainer>
    </>
  );
};

export default withPayment(SeatsAndBilling);
