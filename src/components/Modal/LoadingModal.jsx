import React from 'react';

import Modal, { ModalBody } from '@/components/Modal';
import { Spinner } from '@/components/Spinner';

const LoadingModal = ({ open }) => {
  return (
    <Modal isOpen={open} centered size="sm">
      <ModalBody className="text-center my-4">
        <Spinner message="Loading" />
      </ModalBody>
    </Modal>
  );
};

export default LoadingModal;
