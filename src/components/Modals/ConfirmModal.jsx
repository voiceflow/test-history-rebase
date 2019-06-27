import Button from 'components/Button';
// Components
import { ModalHeader } from 'components/Modals/ModalHeader';
// Actions
import { clearModal } from 'ducks/modal';
import React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';

export const ConfirmModal = ({ toggle, confirm }) => {
  // TODO this class is pure cancer
  if (!confirm) {
    return null;
  }
  const cancel = confirm.cancel === undefined || confirm.cancel;
  return (
    <Modal isOpen={!!confirm} toggle={toggle} centered size={confirm.size || 'sm'}>
      {confirm.header && <ModalHeader toggle={toggle}>{confirm.header}</ModalHeader>}
      <ModalBody className="text-center">{confirm.text}</ModalBody>
      <ModalFooter className="justify-content-center">
        {cancel && (
          <Button isFlatGray onClick={toggle}>
            Cancel
          </Button>
        )}
        <Button
          isWarning={confirm.warning}
          isPrimary={!confirm.warning}
          onClick={() => {
            if (typeof confirm.confirm !== 'function') return toggle();
            if (confirm.params) {
              confirm.confirm(...confirm.params);
            } else {
              confirm.confirm();
            }
            toggle();
          }}
        >
          Confirm
        </Button>
      </ModalFooter>
    </Modal>
  );
};

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
