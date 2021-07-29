/* eslint-disable no-shadow */
import React from 'react';

import { Permission } from '@/config/permissions';
import { ModalType } from '@/constants';
import PermissionGate from '@/gates/PermissionGate';
import { useIsOnPaidPlanSelector, useModals } from '@/hooks';
import { Identifier } from '@/styles/constants';

import { Container, UpgradeIcon, UpgradeText } from './components';

function UpgradeButton() {
  const isOnPaidPlan = useIsOnPaidPlanSelector();

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
