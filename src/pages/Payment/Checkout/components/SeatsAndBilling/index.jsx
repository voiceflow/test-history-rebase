import _isNumber from 'lodash/isNumber';
import React from 'react';
import { Tooltip } from 'react-tippy';

import Dropdown from '@/components/Dropdown';
import Flex, { FlexApart } from '@/components/Flex';
import SvgIcon from '@/components/SvgIcon';
import { PERIOD, PERIOD_NAME } from '@/constants';
import StepSection from '@/pages/Payment/components/Section';
import { withPayment } from '@/pages/Payment/context';
import { FadeLeftContainer } from '@/styles/animations/FadeLeft';

import StepHeading from '../StepHeading';
import BillingDropdown from './components/BillingDropdown';
import DiscountMessageContainer from './components/DiscountMessageContainer';
import PriceBox from './components/PriceBox';
import SeatsBillingText from './components/SeatsBillingText';
import SeatsInput from './components/SeatsInput';

function SeatsAndBilling({
  payment: {
    state: { plan, price, period, seats, errors, hasPricing, loading },
    actions: { setPeriod, setSeats },
  },
}) {
  const formErrors = hasPricing ? errors : {};
  let discountMessage;

  if (plan.pricing) {
    if (period === PERIOD.monthly) {
      discountMessage = 'You could be saving 20% with annual billing';
    } else if (period === PERIOD.annually) {
      const savings = (plan.pricing.MO.price - plan.pricing.YR.price) * 0.12 * seats;
      discountMessage = `You're saving $${savings} with annual billing ✨`;
    }
  } else {
    discountMessage = '--';
  }

  const seatError = formErrors?.seats?.message;
  const periodError = formErrors?.period?.message;

  return (
    <>
      <StepHeading heading="2. Seats and billing" />
      <StepSection secondary>
        <FlexApart>
          <Flex>
            <SeatsInput errorMessage={seatError} hasError={!!seatError} onChange={setSeats} value={seats} />
            <SeatsBillingText>
              <div>Editor Seats</div>
              <Dropdown
                options={[
                  {
                    label: 'Monthly',
                    onClick: () => setPeriod(PERIOD.monthly),
                  },
                  {
                    label: 'Annual',
                    onClick: () => setPeriod(PERIOD.annually),
                  },
                ]}
                placement="bottom-start"
              >
                {(ref, onToggle, isOpen) => (
                  <Tooltip disabled={!periodError} title={periodError} position="top-start" theme="warning" distance={5}>
                    <BillingDropdown ref={ref} onClick={onToggle} error={periodError} isOpen={isOpen}>
                      Billed {PERIOD_NAME[period]}
                      <SvgIcon icon="caretDown" color={isOpen ? '5D9DF5' : null} size={7} />
                    </BillingDropdown>
                  </Tooltip>
                )}
              </Dropdown>
            </SeatsBillingText>
          </Flex>
          <div>
            <PriceBox>
              <>
                <div>$</div>
                {!plan.pricing || !_isNumber(price) || loading.price ? <div>&nbsp;--&nbsp;</div> : <div>{price}</div>}
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
}

export default withPayment(SeatsAndBilling);
