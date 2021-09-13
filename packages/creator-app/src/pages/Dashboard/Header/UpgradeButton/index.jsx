import React from 'react';

import { Permission } from '@/config/permissions';
import { ModalType } from '@/constants';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import PermissionGate from '@/gates/PermissionGate';
import { useModals, useSelector } from '@/hooks';
import { Identifier } from '@/styles/constants';

import { Container, UpgradeIcon, UpgradeText } from './components';

function UpgradeButton() {
  const isOnPaidPlan = useSelector(WorkspaceV2.active.isOnPaidPlanSelector);

  const { open: openPaymentsModal } = useModals(ModalType.PAYMENT);

  return (
    <PermissionGate permission={Permission.UPGRADE_WORKSPACE}>
      <>
        {!isOnPaidPlan ? (
          <Container id={Identifier.UPGRADE_BUTTON} onClick={openPaymentsModal}>
            <UpgradeIcon variant="flat" large icon="upgrade" />
            <UpgradeText>UPGRADE WORKSPACE</UpgradeText>
          </Container>
        ) : null}
      </>
    </PermissionGate>
  );
}

export default UpgradeButton;
