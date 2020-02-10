import React from 'react';

import Button from '@/components/LegacyButton';
import { clearModal } from '@/ducks/modal';
import { connect } from '@/hocs';

import { Modal, ModalBody, ModalFooter, ModalHeader } from '../components';

export const ConfirmModal = ({ toggle, confirm }) => {
  if (!confirm) {
    return null;
  }

  const cancel = confirm.cancel === undefined || confirm.cancel;

  return (
    <Modal isOpen={!!confirm} toggle={toggle} centered size={confirm.size || 'sm'}>
      {confirm.header && <ModalHeader toggle={toggle}>{confirm.header}</ModalHeader>}
      <ModalBody className="text-center">{confirm.text}</ModalBody>
      <ModalFooter>
        {cancel && (
          <Button isFlatGray onClick={toggle}>
            Cancel
          </Button>
        )}
        <Button
          className="btn-primary ml-2"
          isPrimary={confirm.warning}
          onClick={() => {
            if (typeof confirm.confirm === 'function') {
              confirm.confirm(...(confirm.params || []));
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

const mapDispatchToProps = {
  toggle: clearModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmModal);
