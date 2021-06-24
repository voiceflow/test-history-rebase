import { Box, Button, ButtonVariant, Flex } from '@voiceflow/ui';
import React from 'react';

import { ModalType } from '@/constants';
import { styled } from '@/hocs';
import { useModals } from '@/hooks';

import { Modal, ModalBody, ModalFooter, ModalHeader } from './components';

const BodyContainer = styled(ModalBody)`
  padding: 30px 32px 60px 32px;
  font-size: 16px;
  text-align: center;
`;

export const SuccessModal = () => {
  const { close, toggle, isOpened, data } = useModals(ModalType.SUCCESS);
  const { message, title, icon, variant = ButtonVariant.PRIMARY } = data;

  return (
    <Modal isOpen={isOpened} toggle={toggle} className="max-w-400" modalname="success">
      <ModalHeader header={title} toggle={toggle} />
      <BodyContainer>
        <Flex column>
          <Box as="img" alt="Success" height={80} src={icon} mb="xl" />
          <div>{message}</div>
        </Flex>
      </BodyContainer>
      <ModalFooter>
        <Button variant={variant} onClick={close}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default SuccessModal;
