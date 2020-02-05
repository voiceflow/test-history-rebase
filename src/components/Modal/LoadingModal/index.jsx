import React from 'react';

import { Spinner } from '@/components/Spinner';

import { Modal, ModalBody } from '../components';

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
