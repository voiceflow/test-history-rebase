import { ModalHeader } from 'components/Modals/ModalHeader';
import { clearModal } from 'ducks/modal';
import React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';

const StandardModal = (props) => {
  // TODO this class is pure cancer
  if (!props.modal) {
    return null;
  }

  return (
    <Modal isOpen={!!props.modal} toggle={props.toggle} centered size={props.modal.size}>
      {props.modal.header && <ModalHeader toggle={props.toggle}>{props.modal.header}</ModalHeader>}
      {props.modal.body && <ModalBody className="text-center">{props.modal.body}</ModalBody>}
      {props.modal.footer && <ModalFooter className="justify-content-center">{props.modal.footer}</ModalFooter>}
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
