import { Button, ButtonVariant } from '@voiceflow/ui';
import React from 'react';

import { clearModal } from '@/ducks/modal';
import { connect } from '@/hocs';

import { Modal, ModalBody, ModalFooter, ModalHeader } from '../components';

export const ConfirmModal = ({ toggle, confirm }) => {
  if (!confirm) {
    return null;
  }

  const cancel = confirm.cancel === undefined || confirm.cancel;

  return (
    <Modal modalname="confirm" isOpen={!!confirm} toggle={toggle} centered size={confirm.size || 'sm'}>
      {confirm.header && <ModalHeader toggle={toggle}>{confirm.header}</ModalHeader>}
      <ModalBody className="text-center">{confirm.text}</ModalBody>
      <ModalFooter style={{ paddingRight: '48px' }}>
        {cancel && (
          <Button isGray variant={ButtonVariant.TERTIARY} onClick={toggle}>
            Cancel
          </Button>
        )}
        <Button
          variant={ButtonVariant.PRIMARY}
          className="btn-primary ml-2"
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
