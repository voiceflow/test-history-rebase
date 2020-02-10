import React from 'react';

import Modal from '@/components/LegacyModal';
import { MODALS } from '@/constants';
import { useModals } from '@/contexts/ModalsContext';

import Payment from '.';

function PaymentModal() {
  const { isOpened, toggle, data } = useModals(MODALS.PAYMENT);

  return (
    <Modal modalname="plan" isOpen={isOpened} toggle={toggle}>
      <Payment focus={data?.focus} />
    </Modal>
  );
}

export default PaymentModal;
