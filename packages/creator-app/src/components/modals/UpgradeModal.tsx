import { replaceVariables } from '@voiceflow/common';
import { PlanType } from '@voiceflow/internal';
import { Box, Button, ButtonVariant, Flex, SvgIcon, Text } from '@voiceflow/ui';
import React from 'react';

import Modal, { ModalBody, ModalFooter } from '@/components/Modal';
import { LimitDetails, upgradeToEnterpriseAction } from '@/config/planLimits';
import { ModalType } from '@/constants';
import { UpgradePrompt } from '@/ducks/tracking';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useModals, useSelector, useTrackingEvents } from '@/hooks';

const UpgradeModal: React.FC = () => {
  const { close, data } = useModals<{ planLimitDetails: LimitDetails; promptOrigin: UpgradePrompt }>(ModalType.UPGRADE_MODAL);
  const { open: openPaymentModal } = useModals<{ planType: PlanType }>(ModalType.PAYMENT);
  const [trackingEvents] = useTrackingEvents();
  const usedEditorSeats = useSelector(WorkspaceV2.active.usedEditorSeatsSelector);

  const handleSubmit = () => {
    if (data.planLimitDetails.onSubmit === upgradeToEnterpriseAction) {
      trackingEvents.trackContactSales({ promptType: data.promptOrigin });
    }
    data.planLimitDetails?.onSubmit({ openPaymentModal });
  };

  if (!data.planLimitDetails) return null;

  const variables = {
    usedEditorSeats,
  };

  return (
    <Modal id={ModalType.UPGRADE_MODAL} title={data.planLimitDetails.modalTitle} maxWidth={392}>
      <ModalBody>
        <Flex style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <Box mb="16px" mt="24px">
            <SvgIcon icon="skillTemplate" size={80} />
          </Box>
          <Text fontWeight={600}>{data.planLimitDetails.title}</Text>
          <Box mt="8px" mb="16px">
            <Text color="#62778c">{replaceVariables(data.planLimitDetails.description, variables)}</Text>
          </Box>
        </Flex>
      </ModalBody>
      <ModalFooter>
        <Box mr="12px">
          <Button variant={ButtonVariant.TERTIARY} squareRadius onClick={close}>
            Cancel
          </Button>
        </Box>
        <Button variant={ButtonVariant.PRIMARY} onClick={handleSubmit}>
          {data.planLimitDetails.submitText}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default UpgradeModal;
