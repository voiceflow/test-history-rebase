import React from 'react';
import { connect } from 'react-redux';

import { clearModal } from '@/ducks/modal';

import { Modal, ModalBody, ModalFooter, ModalHeader } from './components';

export const StandardModal = ({ modal, toggle }) => {
  if (!modal) {
    return null;
  }

  return (
    <Modal isOpen={!!modal} toggle={toggle} centered size={modal.size}>
      {modal.header && <ModalHeader toggle={toggle}>{modal.header}</ModalHeader>}
      {modal.body && <ModalBody className="text-center">{modal.body}</ModalBody>}
      {modal.footer && <ModalFooter className="justify-content-center">{modal.footer}</ModalFooter>}
    </Modal>
  );
};

const mapStateToProps = (state) => ({
  modal: state.modal.modal,
});

const mapDispatchToProps = {
  toggle: clearModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StandardModal);
