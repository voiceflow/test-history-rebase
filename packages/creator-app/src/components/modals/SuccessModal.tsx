import { Box, Button, ButtonVariant, Flex } from '@voiceflow/ui';
import React from 'react';

import Modal, { ModalBody, ModalFooter } from '@/components/Modal';
import { ModalType } from '@/constants';
import { useModals } from '@/hooks';

const SuccessModal: React.FC = () => {
  const { close, data } = useModals<{ message: React.ReactNode; title: React.ReactNode; icon: string; variant: ButtonVariant }>(ModalType.SUCCESS);
  const { message, title, icon, variant = ButtonVariant.PRIMARY } = data;

  return (
    <Modal id={ModalType.SUCCESS} title={title} maxWidth={400}>
      <ModalBody fontSize="16px" padding="30px 32px 60px 32px !important" textAlign="center">
        <Flex column>
          <Box as="img" alt="Success" height={80} src={icon} mb="xl" />
          <div>{message}</div>
        </Flex>
      </ModalBody>

      <ModalFooter>
        <Button variant={variant} onClick={close}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default SuccessModal;
