import React from 'react';

import { ModalFooter } from '@/components/Modal';
import ChatWithUsLink from '@/containers/Payment/components/ChatWithUsLink';
import { withPayment } from '@/containers/Payment/context';
import { FadeLeftContainer } from '@/styles/animations/FadeLeft';

import CheckoutButton from './components/CheckoutButton';
import Container from './components/Container';
import PaymentDetails from './components/PaymentDetails';
import PlanDetailsContainer from './components/PlanDetailsContainer';
import SeatsAndBilling from './components/SeatsAndBilling';
import SelectPlan from './components/SelectPlan';

function UpdatePlan({
  payment: {
    state: { hasPricing, loading },
  },
}) {
  return (
    <>
      <Container disabled={loading.checkout}>
        <FadeLeftContainer>
          <SelectPlan />
          <PlanDetailsContainer disabled={!hasPricing}>
            <SeatsAndBilling />
            <PaymentDetails />
          </PlanDetailsContainer>
        </FadeLeftContainer>
      </Container>
      <ModalFooter justifyContent="space-between">
        <ChatWithUsLink />
        <CheckoutButton />
      </ModalFooter>
    </>
  );
}

export default withPayment(UpdatePlan);
