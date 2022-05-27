import { PlanType } from '@voiceflow/internal';
import { Box, Button, ButtonVariant, Flex, SvgIcon, Text } from '@voiceflow/ui';
import React from 'react';

import Modal, { ModalBody, ModalFooter } from '@/components/Modal';
import { LimitDetails } from '@/config/planLimits';
import { ModalType } from '@/constants';
import { useModals } from '@/hooks';

const UpgradeModal: React.FC = () => {
  const { close, data } = useModals<{ planLimitDetails: LimitDetails }>(ModalType.UPGRADE_MODAL);
  const { open: openPaymentModal } = useModals<{ planType: PlanType }>(ModalType.PAYMENT);

  const handleSubmit = () => {
    data.planLimitDetails?.onSubmit({ openPaymentModal });
  };

  if (!data.planLimitDetails) return null;

  return (
    <Modal id={ModalType.UPGRADE_MODAL} title={data.planLimitDetails.modalTitle} maxWidth={392}>
      <ModalBody>
        <Flex style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <Box mb="16px" mt="24px">
            <SvgIcon icon="skillTemplate" size={80} />
          </Box>
          <Text fontWeight={600}>{data.planLimitDetails.title}</Text>
          <Box mt="16px" mb="17px">
            <Text color="#62778c">{data.planLimitDetails.description}</Text>
          </Box>
        </Flex>
      </ModalBody>
      <ModalFooter>
        <Box mr="12px">
          <Button variant={ButtonVariant.TERTIARY} squareRadius onClick={close}>
            Cancel
          </Button>
        </Box>
        <Button variant={ButtonVariant.PRIMARY} squareRadius onClick={handleSubmit}>
          {data.planLimitDetails.submitText}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default UpgradeModal;
