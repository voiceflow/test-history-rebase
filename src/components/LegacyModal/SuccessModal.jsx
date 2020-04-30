import React from 'react';

import Box from '@/components/Box';
import Flex from '@/components/Flex';
import Button from '@/components/LegacyButton';
import { ModalType } from '@/constants';
import { styled } from '@/hocs';
import { useModals } from '@/hooks';

import { Modal, ModalBody, ModalFooter, ModalHeader } from './components';

const BodyContainer = styled(ModalBody)`
  font-size: 16px;
  padding: 30px 32px 60px 32px;
  text-align: center;
`;

export const SuccessModal = () => {
  const { close, toggle, isOpened, data } = useModals(ModalType.SUCCESS);
  const { message, title } = data;

  return (
    <Modal isOpen={isOpened} toggle={toggle} className="max-w-400">
      <ModalHeader header={title} toggle={toggle} />
      <BodyContainer>
        <Flex column>
          <Box as="img" alt="Success" height={100} src="/images/icons/takeoff.svg" mb="xl" />
          <div>{message}</div>
        </Flex>
      </BodyContainer>
      <ModalFooter>
        <Button isPrimary onClick={close}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default SuccessModal;
