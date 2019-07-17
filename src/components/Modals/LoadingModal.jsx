import { Spinner } from 'components/Spinner';
import React from 'react';
import { Modal, ModalBody } from 'reactstrap';

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
