import React from 'react';

import { ModalFooter } from '@/components/Modal';
import { Permission } from '@/config/permissions';
import { usePermission } from '@/hooks';
import ChatWithUsLink from '@/pages/Payment/components/ChatWithUsLink';
import { PaymentContextProps, withPayment } from '@/pages/Payment/context';
import { FadeLeftContainer } from '@/styles/animations';

import Container from './components/Container';
import PaymentDetails from './components/PaymentDetails';
import PlanDetailsContainer from './components/PlanDetailsContainer';
import SeatsAndBilling from './components/SeatsAndBilling';
import SelectPlan from './components/SelectPlan';
import CheckoutButton from './components/SelectPlan/CheckoutButton';

interface UpdatePlanProps {
  payment: PaymentContextProps;
}

const UpdatePlan: React.FC<UpdatePlanProps> = ({
  payment: {
    state: { hasPricing, loading },
  },
}) => {
  const [isAllowed] = usePermission(Permission.UPGRADE_WORKSPACE);

  return (
    <>
      <Container disabled={loading.checkout} invalid={!isAllowed}>
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
};

export default withPayment(UpdatePlan);
