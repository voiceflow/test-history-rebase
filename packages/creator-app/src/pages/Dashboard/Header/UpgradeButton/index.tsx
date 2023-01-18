import { IconButtonVariant } from '@voiceflow/ui';
import React from 'react';

import { ModalType } from '@/constants';
import { Permission } from '@/constants/permissions';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import PermissionGate from '@/gates/PermissionGate';
import { useModals, useSelector } from '@/hooks';
import { Identifier } from '@/styles/constants';

import { Container, UpgradeIcon, UpgradeText } from './components';

const UpgradeButton: React.OldFC = () => {
  const isWorkspaceOnPaidPlan = useSelector(WorkspaceV2.active.isOnPaidPlanSelector);

  const { open: openPaymentsModal } = useModals(ModalType.PAYMENT);

  return (
    <PermissionGate permission={Permission.UPGRADE_WORKSPACE}>
      <>
        {!isWorkspaceOnPaidPlan ? (
          <Container id={Identifier.UPGRADE_BUTTON} onClick={openPaymentsModal}>
            <UpgradeIcon variant={IconButtonVariant.FLAT} icon="upgrade" />
            <UpgradeText>UPGRADE WORKSPACE</UpgradeText>
          </Container>
        ) : null}
      </>
    </PermissionGate>
  );
};

export default UpgradeButton;
