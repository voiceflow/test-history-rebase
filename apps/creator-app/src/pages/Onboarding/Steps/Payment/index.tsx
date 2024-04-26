import { BillingPeriod, PlanType } from '@voiceflow/internal';
import { Box, Button, Dropdown, Menu, SvgIcon, toast } from '@voiceflow/ui';
import _isEmpty from 'lodash/isEmpty';
import * as Normal from 'normal-store';
import React, { useContext } from 'react';

import { teamGraphic } from '@/assets';
import client from '@/client';
import DropdownWithCaret from '@/components/DropdownWithCaret';
import { TextVariant } from '@/components/DropdownWithCaret/types';
import { CardElement } from '@/components/Stripe';
import { PERIOD_NAME } from '@/constants';
import * as Account from '@/ducks/account';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDebouncedCallback, useSelector } from '@/hooks';
import { OnboardingContext } from '@/pages/Onboarding/context';
import { isAdminUserRole, isEditorUserRole } from '@/utils/role';

import {
  BillingDropdown,
  BubbleTextContainer,
  Container,
  CostText,
  CostTimeUnit,
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

  const { state, actions } = useContext(OnboardingContext);

  const { plan, period } = state.paymentMeta;
  const { sendingRequests, selectableWorkspace, hasFixedPeriod } = state;

  const numberOfSeats = actions.getNumberOfEditors();

  const [creditCardComplete, setCreditCardComplete] = React.useState(false);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = React.useState('');
  const [paymentPeriod, setPaymentPeriod] = React.useState(period);
  const [creditCardError, setCreditCardError] = React.useState('');
  const [seatCount, setSeatCount] = React.useState(numberOfSeats);
  const [selectedPlan, setSelectedPlan] = React.useState(plan);
  const [priceError, setPriceError] = React.useState('');
  const [price, setPrice] = React.useState(0);

  const dollarPrice = price / 100;
  const workspaceComplete = !selectableWorkspace || (selectableWorkspace && !!selectedWorkspaceId);
  const canContinue = !creditCardError && creditCardComplete && !priceError && workspaceComplete;
  // methods
  const onContinue = async () => {
    actions.setPaymentMeta({
      ...state.paymentMeta,
      seats: seatCount,
      period: paymentPeriod,
      plan: selectedPlan,
      selectedWorkspaceId,
    });

    actions.stepForward(null);
  };

  const isWorkspaceAdmin = (workspaceID: string) => {
    const workspace = getWorkspaceByID({ id: workspaceID });

    if (!workspace?.members) return false;

    return Normal.denormalize(workspace.members).some(
      (member) => member.creator_id === creatorID && isAdminUserRole(member.role)
    );
  };

  const handleStripeOnChange = ({ error }: any) => {
    setCreditCardError(error);
  };

  const getPrice = useDebouncedCallback(
    500,
    async (selectedPlan: PlanType, seatCount: number, paymentPeriod: BillingPeriod) => {
      const { price, errors } = await client.workspace.calculatePrice(GET_PRICE_WITHOUT_TEAM_ID_CONST, {
        plan: selectedPlan,
        seats: seatCount,
        period: paymentPeriod,
      });

      if (_isEmpty(errors)) {
        setPrice(price);
      }
    },
    [setPrice, setPriceError, selectedPlan]
  );

  // effects
  React.useEffect(() => {
    getPrice(selectedPlan!, seatCount, paymentPeriod);
  }, [paymentPeriod, selectedPlan, seatCount, setPriceError]);

  React.useEffect(() => {
    const workspace = getWorkspaceByID({ id: selectedWorkspaceId });

    if (!workspace?.members) {
      setSeatCount(0);
      return;
    }

    const numberOfEditors = Normal.denormalize(workspace.members).reduce(
      (acc, member) => acc + (isEditorUserRole(member.role) ? 1 : 0),
      0
    );

    setSeatCount(Math.max(seatCount, numberOfEditors));
  }, [selectedWorkspaceId]);

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
        text: selectedWorkspaceId
          ? `Workspace: ${getWorkspaceByID({ id: selectedWorkspaceId })?.name}`
          : 'Select a Workspace',
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
        <Box.FlexCenter>
          <DropdownWithCaret
            text={dropdownConfig.text}
            capitalized
            textVariant={TextVariant.secondary}
            placement="bottom-end"
            menu={dropdownConfig.menu}
          />
        </Box.FlexCenter>

        <InfoBubble>
          <img src={teamGraphic} alt="team" height={64} />

          <BubbleTextContainer column>
            <EditorSeatsText>{seatCount} Editor Seats</EditorSeatsText>

            <PeriodDropdownContainer>
              <Dropdown
                options={[
                  { label: 'Monthly', onClick: () => setPaymentPeriod(BillingPeriod.MONTHLY) },
                  { label: 'Annually', onClick: () => setPaymentPeriod(BillingPeriod.ANNUALLY) },
                ]}
                placement="bottom-start"
              >
                {({ ref, onToggle, isOpen }) => (
                  <BillingDropdown
                    ref={ref}
                    isOpen={isOpen}
                    onClick={() => !hasFixedPeriod && onToggle()}
                    disabled={hasFixedPeriod}
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
          <Box.FlexApart mb={8}>
            <PaymentDetailsText>Payment Details</PaymentDetailsText>
          </Box.FlexApart>

          <CardElement onChangeComplete={setCreditCardComplete} stripeOnChange={handleStripeOnChange} />
        </PaymentDetailsContainer>

        <Box.FlexCenter>
          <Button disabled={!canContinue || sendingRequests} onClick={onContinue}>
            {sendingRequests ? (
              <SvgIcon icon="arrowSpin" size={24} spin />
            ) : (
              <>
                Pay{' '}
                {creditCardComplete && (
                  <CostText> ${paymentPeriod === BillingPeriod.MONTHLY ? dollarPrice : 12 * dollarPrice} </CostText>
                )}
              </>
            )}
          </Button>
        </Box.FlexCenter>
      </Container>
    </>
  );
};

export default Payment;
