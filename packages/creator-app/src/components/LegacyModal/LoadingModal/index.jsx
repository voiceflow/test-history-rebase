import { Spinner } from '@voiceflow/ui';
import React from 'react';

import { ModalType } from '@/constants';
import { useModals } from '@/hooks';

import { Modal, ModalBody } from '../components';

const LoadingModal = () => {
  const { isOpened, toggle } = useModals(ModalType.LOADING);

  return (
    <Modal isOpen={isOpened} toggle={toggle} centered size="sm" modalname="loading">
      <ModalBody className="text-center my-4">
        <Spinner message="Loading" />
      </ModalBody>
    </Modal>
  );
};

export default LoadingModal;
