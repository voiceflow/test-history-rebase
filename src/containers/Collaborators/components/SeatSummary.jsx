import React from 'react';

import ClickableText from '@/componentsV2/Text/ClickableText';
import { MODALS, PLANS, UNLIMITED_SEAT_NUMBER } from '@/constants';
import { useModals } from '@/contexts/ModalsContext';
import { planTypeSelector, seatLimits, usedEditorSeats, usedViewerSeats, workspaceNumberOfSeatsSelector } from '@/ducks/workspace';
import { connect, styled } from '@/hocs';

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

function SeatSummary({ numberOfSeats, plan, seatLimits, usedEditorSeats, usedViewerSeats }) {
  const { open: openPaymentsModal } = useModals(MODALS.PAYMENT);

  const numberOfUsedEditorSeats = usedEditorSeats;
  const numberOfUsedViewerSeats = usedViewerSeats;

  const viewerSeatLimit = seatLimits.viewer;

  const editorSeatsMessage =
    numberOfSeats >= UNLIMITED_SEAT_NUMBER ? 'Unlimited Editors.' : `${numberOfUsedEditorSeats} of ${numberOfSeats} Editor seats taken.`;
  const viewerSeatsMessage =
    viewerSeatLimit >= UNLIMITED_SEAT_NUMBER ? 'Unlimited Viewers.' : `${numberOfUsedViewerSeats} of ${viewerSeatLimit} Viewer seats taken.`;

  return (
    <Container>
      <Number>
        <span>
          <Text>
            {editorSeatsMessage} {(viewerSeatLimit === null || viewerSeatLimit > 0) && <>{viewerSeatsMessage}</>}
          </Text>
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
  usedViewerSeats,
  numberOfSeats: workspaceNumberOfSeatsSelector,
  seatLimits,
  plan: planTypeSelector,
};

export default connect(mapStateToProps)(SeatSummary);
