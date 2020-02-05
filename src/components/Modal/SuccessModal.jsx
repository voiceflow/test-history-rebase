import React from 'react';

import Button from '@/components/Button';
import SvgIcon from '@/components/SvgIcon';
import Flex from '@/componentsV2/Flex';
import { MODALS } from '@/constants';
import { useModals } from '@/contexts/ModalsContext';
import { styled } from '@/hocs';

import { Modal, ModalBody, ModalFooter, ModalHeader } from './components';

const BodyContainer = styled(ModalBody)`
  font-size: 16px;
  padding: 30px 32px 60px 32px;
  text-align: center;
`;

const SuccessImage = styled(SvgIcon)`
  margin-bottom: 20px;
`;

export const SuccessModal = () => {
  const { close, toggle, isOpened, data } = useModals(MODALS.SUCCESS);
  const { message, title } = data;

  return (
    <Modal isOpen={isOpened} toggle={toggle} className="max-w-400">
      <ModalHeader header={title} toggle={toggle} />
      <BodyContainer>
        <Flex column>
          <SuccessImage size={100} icon="takeoff" />
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
