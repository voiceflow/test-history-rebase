import React from 'react';

import ClickableText from '@/componentsV2/Text/ClickableText';
import { MODALS, PLANS } from '@/constants';
import { useModals } from '@/contexts/ModalsContext';
import { activeWorkspaceMembersSelector, planTypeSelector, workspaceNumberOfSeatsSelector } from '@/ducks/workspace';
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

function SeatSummary({ numberOfSeats, members, plan }) {
  const numberOfUsedSeats = members.length || 1;
  const { open: openPaymentsModal } = useModals(MODALS.PAYMENT);

  return (
    <Container>
      <Number>
        <span>
          {numberOfUsedSeats} <Text>of {numberOfSeats} seats are taken.</Text>
        </span>
      </Number>

      {plan !== PLANS.enterprise && (
        <ClickableText onClick={openPaymentsModal}>{plan === PLANS.team ? <span>Need more room?</span> : <span>Upgrade</span>}</ClickableText>
      )}
    </Container>
  );
}

const mapStateToProps = {
  numberOfSeats: workspaceNumberOfSeatsSelector,
  members: activeWorkspaceMembersSelector,
  plan: planTypeSelector,
};

export default connect(mapStateToProps)(SeatSummary);
