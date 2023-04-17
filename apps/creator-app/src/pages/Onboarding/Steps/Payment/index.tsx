import { BillingPeriod, PlanType } from '@voiceflow/internal';
import { Button, ClickableText, ControlledInput, Dropdown, FlexApart, FlexCenter, Menu, SvgIcon, toast } from '@voiceflow/ui';
import _isEmpty from 'lodash/isEmpty';
import * as Normal from 'normal-store';
import React, { useContext } from 'react';

import { teamGraphic } from '@/assets';
import client from '@/client';
import Collapsable from '@/components/Collapsable';
import DropdownWithCaret from '@/components/DropdownWithCaret';
import { TextVariant } from '@/components/DropdownWithCaret/types';
import { CardElement } from '@/components/Stripe';
import { PERIOD_NAME } from '@/constants';
import * as Account from '@/ducks/account';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDebouncedCallback, useSelector, useToggle } from '@/hooks';
import { OnboardingContext } from '@/pages/Onboarding/context';
import { SpecificFlowType } from '@/pages/Onboarding/context/types';
import { isAdminOrOwnerUserRole, isEditorUserRole } from '@/utils/role';

import {
  BillingDropdown,
  BubbleTextContainer,
  Container,
  CostText,
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

export const GET_PRICE_WITHOUT_TEAM_ID_CONST = 'none';

const Payment: React.FC = () => {
  const workspaces = useSelector(WorkspaceV2.allWorkspacesSelector);
  const getWorkspaceByID = useSelector(WorkspaceV2.getWorkspaceByIDSelector);
  const creatorID = useSelector(Account.userIDSelector);
  const referrerID = useSelector(Account.referrerIDSelector);
  const referralCode = useSelector(Account.referralCodeSelector);

  const { state, actions } = useContext(OnboardingContext);

  const { plan, couponCode, period } = state.paymentMeta;
  const { sendingRequests, selectableWorkspace, hasFixedPeriod, specificFlowType } = state;

  const numberOfSeats = actions.getNumberOfEditors();

  const [creditCardComplete, setCreditCardComplete] = React.useState(false);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = React.useState('');
  const [paymentPeriod, setPaymentPeriod] = React.useState(period);
  const [creditCardError, setCreditCardError] = React.useState('');
  const [seatCount, setSeatCount] = React.useState(numberOfSeats);
  const [selectedPlan, setSelectedPlan] = React.useState(plan);
  const [coupon, setCoupon] = React.useState(couponCode || '');
  const [usingCoupon, toggleCoupon] = useToggle(!!couponCode);
  const [couponError, setCouponError] = React.useState('');
  const [priceError, setPriceError] = React.useState('');
  const [price, setPrice] = React.useState(0);

  const dollarPrice = price / 100;
  const workspaceComplete = !selectableWorkspace || (selectableWorkspace && !!selectedWorkspaceId);
  const canContinue = !creditCardError && !couponError && creditCardComplete && !priceError && workspaceComplete;
  const isPromoPlanCreation = specificFlowType === SpecificFlowType.login_student_new || specificFlowType === SpecificFlowType.login_creator_new;

  // methods
  const onContinue = async () => {
    actions.setPaymentMeta({
      ...state.paymentMeta,
      seats: seatCount,
      couponCode: coupon,
      period: paymentPeriod,
      plan: selectedPlan,
      selectedWorkspaceId,
    });

    actions.stepForward(null);
  };

  const isWorkspaceAdmin = (workspaceID: string) => {
    const workspace = getWorkspaceByID({ id: workspaceID });

    if (!workspace?.members) return false;

    return Normal.denormalize(workspace.members).some((member) => member.creator_id === creatorID && isAdminOrOwnerUserRole(member.role));
  };

  const handleStripeOnChange = ({ error }: any) => {
    setCreditCardError(error);
  };

  const getPrice = useDebouncedCallback(
    500,
    async (selectedPlan: PlanType, seatCount: number, paymentPeriod: BillingPeriod, coupon: string) => {
      const { price, errors } = await client.workspace.calculatePrice(GET_PRICE_WITHOUT_TEAM_ID_CONST, {
        plan: selectedPlan,
        seats: seatCount,
        period: paymentPeriod,
        coupon: coupon || undefined,
      });

      if (_isEmpty(errors)) {
        setPrice(price);
        setCouponError('');
      } else {
        setCouponError(errors.coupon?.message || '');
      }
    },
    [setPrice, setCouponError, setPriceError, setCouponError, selectedPlan]
  );

  const prePopulateCoupon = async () => {
    const stripePromotion = await client.user.getReferralCouponCode(referrerID!, referralCode!);

    if (stripePromotion) {
      toggleCoupon();
      setCoupon(referralCode!);
    }
  };

  // effects
  React.useEffect(() => {
    getPrice(selectedPlan!, seatCount, paymentPeriod, coupon);
  }, [coupon, paymentPeriod, selectedPlan, seatCount, setCouponError, setPriceError]);

  React.useEffect(() => {
    const workspace = getWorkspaceByID({ id: selectedWorkspaceId });

    if (!workspace?.members) {
      setSeatCount(0);
      return;
    }

    const numberOfEditors = Normal.denormalize(workspace.members).reduce((acc, member) => acc + (isEditorUserRole(member.role) ? 1 : 0), 0);

    setSeatCount(Math.max(seatCount, numberOfEditors));
  }, [selectedWorkspaceId]);

  // pre-populate stripe coupon or promotion code
  React.useEffect(() => {
    if (referrerID && referralCode) {
      prePopulateCoupon();
    }
  }, [referrerID, referralCode]);

  const dropdownConfig = !selectableWorkspace
    ? {
        text: `${selectedPlan} PLAN`,
        menu: (
          <Menu>
            <Menu.Item onClick={() => setSelectedPlan(PlanType.PRO)}>Pro Plan</Menu.Item>
          </Menu>
        ),
      }
    : {
        text: selectedWorkspaceId ? `Workspace: ${getWorkspaceByID({ id: selectedWorkspaceId })?.name}` : 'Select a Workspace',
        menu: (
          <Menu>
            {workspaces.map((workspace) => (
              <Menu.Item
                key={workspace.id}
                onClick={() => {
                  if (isWorkspaceAdmin(workspace.id)) {
                    setSelectedWorkspaceId(workspace.id);
                  } else {
                    toast.error('You are not the Admin of this workspace');
                  }
                }}
              >
                {workspace.name}
              </Menu.Item>
            ))}
          </Menu>
        ),
      };

  return (
    <>
      <Container>
        <FlexCenter>
          <DropdownWithCaret
            text={dropdownConfig.text}
            capitalized
            disabled={isPromoPlanCreation}
            textVariant={TextVariant.secondary}
            placement="bottom-end"
            menu={dropdownConfig.menu}
          />
        </FlexCenter>
        <InfoBubble>
          <img src={teamGraphic} alt="team" height={64} />
          <BubbleTextContainer column>
            <EditorSeatsText>{seatCount} Editor Seats</EditorSeatsText>
            <PeriodDropdownContainer>
              <Dropdown
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
                {({ ref, onToggle, isOpen }) => (
                  <BillingDropdown
                    disabled={hasFixedPeriod}
                    ref={ref}
                    onClick={() => {
                      if (!hasFixedPeriod) {
                        onToggle();
                      }
                    }}
                    isOpen={isOpen}
                  >
                    Billed {PERIOD_NAME[paymentPeriod]}
                    <SvgIcon icon="caretDown" color={isOpen ? '5D9DF5' : ''} size={7} />
                  </BillingDropdown>
                )}
              </Dropdown>
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
              onChange={(e) => {
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
          <Button disabled={!canContinue || sendingRequests} onClick={onContinue}>
            {sendingRequests ? (
              <SvgIcon icon="arrowSpin" size={24} spin />
            ) : (
              <>Pay {creditCardComplete && <CostText> ${paymentPeriod === BillingPeriod.MONTHLY ? dollarPrice : 12 * dollarPrice} </CostText>}</>
            )}
          </Button>
        </FlexCenter>
      </Container>
    </>
  );
};

export default Payment;
