import React from 'react';

import { ClickableText } from '@/components/Text';
import { ModalType, PLANS } from '@/constants';
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
      {plan !== PLANS.ENTERPRISE && (
        <ClickableText onClick={openPaymentsModal}>{plan === PLANS.TEAM ? <span>Need more room?</span> : <span>Upgrade</span>}</ClickableText>
      )}
    </Container>
  );
}

const mapStateToProps = {
  plan: planTypeSelector,
};

export default connect(mapStateToProps)(SeatSummary);
