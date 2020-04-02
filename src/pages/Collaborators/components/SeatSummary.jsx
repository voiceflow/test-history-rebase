import React from 'react';

import ClickableText from '@/components/Text/ClickableText';
import { ModalType, PLANS, UNLIMITED_SEAT_NUMBER } from '@/constants';
import { planTypeSelector, usedEditorSeats, workspaceNumberOfSeatsSelector } from '@/ducks/workspace';
import { connect, styled } from '@/hocs';
import { useModals } from '@/hooks';

const Container = styled.div`
  font-size: 13px;
`;

const Number = styled.div`
  color: #62778c;
  display: inline-block;
  margin-right: 4px;
`;

const Text = styled.div`
  color: #8da2b5;
  display: inline-block;
`;

function SeatSummary({ numberOfSeats, plan, usedEditorSeats }) {
  const { open: openPaymentsModal } = useModals(ModalType.PAYMENT);

  const numberOfUsedEditorSeats = usedEditorSeats;

  const editorSeatsMessage =
    numberOfSeats >= UNLIMITED_SEAT_NUMBER ? 'Unlimited Editors.' : `${numberOfUsedEditorSeats} of ${numberOfSeats} Editor seats taken.`;

  return (
    <Container>
      <Number>
        <span>
          <Text>{editorSeatsMessage}</Text>
        </span>
      </Number>
      {plan !== PLANS.enterprise && (
        <ClickableText onClick={openPaymentsModal}>{plan === PLANS.team ? <span>Need more room?</span> : <span>Upgrade</span>}</ClickableText>
      )}
    </Container>
  );
}

const mapStateToProps = {
  usedEditorSeats,
  numberOfSeats: workspaceNumberOfSeatsSelector,
  plan: planTypeSelector,
};

export default connect(mapStateToProps)(SeatSummary);
