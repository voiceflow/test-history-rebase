import Button from 'components/Button';
// Components
import { ModalHeader } from 'components/Modals/ModalHeader';
// Actions
import { clearModal } from 'ducks/modal';
import React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';

const ConfirmModal = (props) => {
  // TODO this class is pure cancer
  if (!props.confirm) {
    return null;
  }
  const cancel = props.confirm.cancel !== undefined ? props.confirm.cancel : true;
  return (
    <Modal isOpen={!!props.confirm} toggle={props.toggle} centered size={props.confirm.size || 'sm'}>
      {props.confirm.header && <ModalHeader toggle={props.toggle}>{props.confirm.header}</ModalHeader>}
      <ModalBody className="text-center">{props.confirm.text}</ModalBody>
      <ModalFooter className="justify-content-center">
        {cancel && (
          <Button isFlatGray onClick={props.toggle}>
            Cancel
          </Button>
        )}
        <Button
          isWarning={props.confirm.warning}
          isPrimary={!props.confirm.warning}
          onClick={() => {
            if (typeof props.confirm.confirm !== 'function') return props.toggle();
            if (props.confirm.params) {
              props.confirm.confirm(...props.confirm.params);
            } else {
              props.confirm.confirm();
            }
            props.toggle();
          }}
        >
          Confirm
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export { ConfirmModal };

const mapStateToProps = (state) => ({
  confirm: state.modal.confirmModal,
});

const mapDispatchToProps = (dispatch) => {
  return {
    toggle: () => dispatch(clearModal()),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmModal);
