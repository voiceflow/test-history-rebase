import { Modal } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/constants/permissions';
import { usePermission } from '@/hooks';
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

const UpdatePlan: React.OldFC<UpdatePlanProps> = ({
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

      <Modal.Footer justifyContent="flex-end">
        <CheckoutButton />
      </Modal.Footer>
    </>
  );
};

export default withPayment(UpdatePlan);
