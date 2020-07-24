import { isEmpty } from 'lodash';
import React, { useContext } from 'react';

import client from '@/client';
import Button from '@/components/Button';
import Collapsable from '@/components/Collapsable';
import Dropdown from '@/components/Dropdown';
import DropdownWithCaret from '@/components/DropdownWithCaret';
import { TextVariant } from '@/components/DropdownWithCaret/types';
import { FlexApart, FlexCenter } from '@/components/Flex';
import { ControlledInput } from '@/components/Input';
import Menu, { MenuItem } from '@/components/Menu';
import { CardElement } from '@/components/Stripe';
import SvgIcon from '@/components/SvgIcon';
import { ClickableText } from '@/components/Text';
import { BillingPeriod, PERIOD_NAME, PlanType } from '@/constants';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useDebouncedCallback, useToggle } from '@/hooks';
import { OnboardingContext, getNumberOfEditorSeats } from '@/pages/Onboarding/context';
import { OnboardingProps } from '@/pages/Onboarding/types';
import BillingDropdown from '@/pages/Payment/Checkout/components/SeatsAndBilling/components/BillingDropdown';
import CostText from '@/pages/Payment/Checkout/components/SelectPlan/CheckoutButton/components/CostText';

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
} from './components';

const MenuComponent: any = Menu;

export const GET_PRICE_WITHOUT_TEAM_ID_CONST = 'none';

const DropdownComponent: any = Dropdown;
const PeriodDropdown: any = BillingDropdown;

const Payment: React.FC<OnboardingProps> = ({ workspaces, workspaceSelector }) => {
  const { state, actions } = useContext(OnboardingContext);
  const { plan, couponCode, period } = state.paymentMeta;
  const { sendingRequests, selectableWorkspace } = state;
  const { collaborators } = state.addCollaboratorMeta;

  const numberOfSeats = getNumberOfEditorSeats(collaborators);

  const [usingCoupon, toggleCoupon] = useToggle(!!couponCode);
  const [coupon, setCoupon] = React.useState(couponCode || '');
  const [paymentPeriod, setPaymentPeriod] = React.useState(period);
  const [couponError, setCouponError] = React.useState('');
  const [price, setPrice] = React.useState(0);
  const [priceError, setPriceError] = React.useState('');
  const [creditCardError, setCreditCardError] = React.useState('');
  const [creditCardComplete, setCreditCardComplete] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState(plan);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = React.useState('');
  const workspaceComplete = !selectableWorkspace || (selectableWorkspace && !!selectedWorkspaceId);
  const canContinue = !creditCardError && !couponError && creditCardComplete && !priceError && workspaceComplete;

  const onContinue = async () => {
    actions.setPaymentMeta({
      ...state.paymentMeta,
      couponCode: coupon,
      period: paymentPeriod,
      plan: selectedPlan,
      selectedWorkspaceId,
    });

    actions.stepForward(null);
    actions.finishCreateOnboarding();
  };

  const handleStripeOnChange = ({ error }: any) => {
    setCreditCardError(error);
  };

  const getPrice = useDebouncedCallback(
    500,
    async (selectedPlan: PlanType, numberOfSeats: number, paymentPeriod: BillingPeriod, coupon: string) => {
      const { price, errors } = await client.workspace.calculatePrice(GET_PRICE_WITHOUT_TEAM_ID_CONST, {
        plan: selectedPlan!,
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
    [setPrice, setCouponError, setPriceError, setCouponError, selectedPlan]
  );

  React.useEffect(() => {
    getPrice(selectedPlan!, numberOfSeats, paymentPeriod, coupon);
  }, [coupon, paymentPeriod, selectedPlan, numberOfSeats, setCouponError, setPriceError]);
  const dollarPrice = price / 100;
  const dropdownConfig = !selectableWorkspace
    ? {
        text: `${selectedPlan} PLAN`,
        menu: (
          <MenuComponent>
            <MenuItem onClick={() => setSelectedPlan(PlanType.PRO)}>Pro Plan</MenuItem>
            <MenuItem onClick={() => setSelectedPlan(PlanType.TEAM)}>Team Plan</MenuItem>
          </MenuComponent>
        ),
      }
    : {
        text: selectedWorkspaceId ? `Workspace: ${workspaceSelector!(selectedWorkspaceId).name}` : 'Select a Workspace',
        menu: (
          <MenuComponent>
            {workspaces!.map((workspace) => {
              return (
                <MenuItem key={workspace.id} onClick={() => setSelectedWorkspaceId(workspace.id)}>
                  {workspace.name}
                </MenuItem>
              );
            })}
          </MenuComponent>
        ),
      };

  return (
    <>
      <Container>
        <FlexCenter>
          <DropdownWithCaret
            text={dropdownConfig.text}
            capitalized
            textVariant={TextVariant.secondary}
            placement="bottom-end"
            menu={dropdownConfig.menu}
          />
        </FlexCenter>
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
                    label: 'Annually',
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
            {sendingRequests ? (
              <SvgIcon icon="publishSpin" size={24} spin />
            ) : (
              <>Pay {creditCardComplete && <CostText> ${paymentPeriod === BillingPeriod.MONTHLY ? dollarPrice : 12 * dollarPrice} </CostText>}</>
            )}
          </Button>
        </FlexCenter>
      </Container>
    </>
  );
};

const mapStateToProps = {
  workspaces: Workspace.allWorkspacesSelector,
  workspaceSelector: Workspace.workspaceByIDSelector,
};
export default connect(mapStateToProps)(Payment);
