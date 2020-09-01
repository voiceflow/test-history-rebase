import React from 'react';

import Modal from '@/components/LegacyModal';
import { ModalType } from '@/constants';
import { useModals } from '@/hooks';
import { ClassName } from '@/styles/constants';

import Payment from '.';

function PaymentModal() {
  const { isOpened, toggle, data } = useModals(ModalType.PAYMENT);

  return (
    <Modal className={`${ClassName.MODAL}--payment`} modalname="plan" isOpen={isOpened} toggle={toggle}>
      <Payment focus={data?.focus} />
    </Modal>
  );
}

export default PaymentModal;
