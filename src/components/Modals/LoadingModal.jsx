import React from 'react';
import { Modal, ModalBody } from 'reactstrap';

const LoadingModal = (props) => {
  return (
    <Modal isOpen={props.open} centered size="sm">
      <ModalBody className="text-center my-4">
        <div>
          <h1>
            <span className="loader text-lg" />
          </h1>
          <h5 className="pt-2 mb-0">Loading</h5>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default LoadingModal;
