/* eslint-disable no-shadow */
import React from 'react';

import { FEATURE_IDS, MODALS } from '@/constants';
import { useModals } from '@/contexts/ModalsContext';
import { onPaidPlan } from '@/ducks/workspace';
import RolePermissionGate from '@/gates/RolePermissionGate';
import { connect } from '@/hocs';

import { Container, UpgradeIcon, UpgradeText } from './components';

function UpgradeButton({ onPaidPlan }) {
  const { open: openPaymentsModal } = useModals(MODALS.PAYMENT);

  return (
    <RolePermissionGate featureId={FEATURE_IDS.UPGRADE_WORKSPACE}>
      <>
        {!onPaidPlan ? (
          <Container onClick={openPaymentsModal}>
            <UpgradeIcon variant="flat" large icon="upgrade" />
            <UpgradeText>UPGRADE</UpgradeText>
          </Container>
        ) : null}
      </>
    </RolePermissionGate>
  );
}

const mapStateToProps = {
  onPaidPlan,
};

export default connect(mapStateToProps)(UpgradeButton);
