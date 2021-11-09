import { Utils } from '@voiceflow/common';
import { Box, Button, ButtonVariant } from '@voiceflow/ui';
import React from 'react';

import { ModalBody, ModalFooter, UncontrolledModal } from '@/components/Modal';
import * as ModalDuck from '@/ducks/modal';
import { useDispatch, useSelector } from '@/hooks';

import { UncontrolledBackdrop } from './ModalBackdrop';

const ConfirmModal: React.FC = () => {
  const confirm = useSelector((state) => state.modal.confirmModal);
  const closeModal = useDispatch(ModalDuck.clearModal);

  if (!confirm) {
    return null;
  }

  return (
    <>
      <UncontrolledBackdrop onClose={closeModal} />

      <UncontrolledModal id="confirm" isOpened withHeader={false} centered maxWidth={confirm.maxWidth ?? 300} onClose={closeModal}>
        <ModalBody padding="16px !important" textAlign="center">
          {confirm.text}
        </ModalBody>

        <ModalFooter justifyContent="space-around">
          {(confirm.cancelable ?? true) === true && (
            <Box mr={8}>
              <Button isGray variant={ButtonVariant.TERTIARY} onClick={closeModal}>
                Cancel
              </Button>
            </Box>
          )}

          <Button variant={ButtonVariant.PRIMARY} onClick={Utils.functional.chainVoid(closeModal, confirm.confirm)}>
            Confirm
          </Button>
        </ModalFooter>
      </UncontrolledModal>
    </>
  );
};

export default ConfirmModal;
