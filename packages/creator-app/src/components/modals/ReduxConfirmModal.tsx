import React from 'react';

import { ModalType } from '@/constants';
import * as ModalDuck from '@/ducks/modal';
import { useDispatch, useModals, useSelector } from '@/hooks';

const ReduxConfirmModal: React.OldFC = () => {
  const confirm = useSelector((state) => state.modal.confirmModal);
  const closeModal = useDispatch(ModalDuck.clearModal);
  const confirmModal = useModals(ModalType.CONFIRM);

  React.useEffect(() => {
    if (!confirm) return;

    confirmModal.open(confirm, closeModal);
  }, [!!confirm]);

  return null;
};

export default ReduxConfirmModal;
