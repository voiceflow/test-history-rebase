/* eslint-disable no-shadow */
import React from 'react';

import { Permission } from '@/config/permissions';
import { ModalType } from '@/constants';
import * as Workspace from '@/ducks/workspace';
import PermissionGate from '@/gates/PermissionGate';
import { connect } from '@/hocs';
import { useModals } from '@/hooks';

import { Container, UpgradeIcon, UpgradeText } from './components';

function UpgradeButton({ isOnPaidPlan }) {
  const { open: openPaymentsModal } = useModals(ModalType.PAYMENT);

  return (
    <PermissionGate permission={Permission.UPGRADE_WORKSPACE}>
      <>
        {!isOnPaidPlan ? (
          <Container onClick={openPaymentsModal}>
            <UpgradeIcon variant="flat" large icon="upgrade" />
            <UpgradeText>UPGRADE WORKSPACE</UpgradeText>
          </Container>
        ) : null}
      </>
    </PermissionGate>
  );
}

const mapStateToProps = {
  isOnPaidPlan: Workspace.isOnPaidPlanSelector,
};

export default connect(mapStateToProps)(UpgradeButton);
