import { ModalHeader } from 'components/Modals/ModalHeader';
import { clearModal } from 'ducks/modal';
import React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';

const StandardModal = ({ modal, toggle }) => {
  // TODO this class is pure cancer
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

export { StandardModal };

const mapStateToProps = (state) => ({
  modal: state.modal.modal,
});

const mapDispatchToProps = (dispatch) => {
  return {
    toggle: () => dispatch(clearModal()),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StandardModal);
