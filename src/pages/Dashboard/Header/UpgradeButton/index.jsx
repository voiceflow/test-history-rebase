/* eslint-disable no-shadow */
import React from 'react';

import { FEATURE_IDS, ModalType } from '@/constants';
import * as Workspace from '@/ducks/workspace';
import RolePermissionGate from '@/gates/RolePermissionGate';
import { connect } from '@/hocs';
import { useModals } from '@/hooks';

import { Container, UpgradeIcon, UpgradeText } from './components';

function UpgradeButton({ isOnPaidPlan }) {
  const { open: openPaymentsModal } = useModals(ModalType.PAYMENT);

  return (
    <RolePermissionGate featureId={FEATURE_IDS.UPGRADE_WORKSPACE}>
      <>
        {!isOnPaidPlan ? (
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
  isOnPaidPlan: Workspace.isOnPaidPlanSelector,
};

export default connect(mapStateToProps)(UpgradeButton);
