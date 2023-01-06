import React from 'react';

import { ModalBody, ModalFooter, UncontrolledModal } from '@/components/Modal';
import * as ModalDuck from '@/ducks/modal';
import { useDispatch, useSelector } from '@/hooks';

import { UncontrolledBackdrop } from './ModalBackdrop';

const StandardModal: React.OldFC = () => {
  const modal = useSelector((state) => state.modal.modal);
  const closeModal = useDispatch(ModalDuck.clearModal);

  if (!modal) {
    return null;
  }

  return (
    <>
      <UncontrolledBackdrop onClose={closeModal} />

      <UncontrolledModal
        title={modal.title}
        onClose={closeModal}
        isOpened
        centered
        maxWidth={modal.maxWidth ?? 350}
        withHeader={modal.withHeader ?? false}
      >
        {modal.body && <ModalBody textAlign="center">{modal.body}</ModalBody>}
        {modal.footer && <ModalFooter justifyContent="center">{modal.footer}</ModalFooter>}
      </UncontrolledModal>
    </>
  );
};

export default StandardModal;
