import React from 'react';

import { ClickableText } from '@/components/Text';
import { ModalType, PlanType } from '@/constants';
import { planTypeSelector } from '@/ducks/workspace';
import { connect, styled } from '@/hocs';
import { useModals } from '@/hooks';

const Container = styled.div`
  font-size: 13px;
`;

function SeatSummary({ plan }) {
  const { open: openPaymentsModal } = useModals(ModalType.PAYMENT);

  return (
    <Container>
      {plan !== PlanType.ENTERPRISE && (
        <ClickableText onClick={openPaymentsModal}>{plan === PlanType.TEAM ? <span>Need more room?</span> : <span>Upgrade</span>}</ClickableText>
      )}
    </Container>
  );
}

const mapStateToProps = {
  plan: planTypeSelector,
};

export default connect(mapStateToProps)(SeatSummary);
