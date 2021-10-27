import React from 'react';

import Modal from '@/components/Modal';
import { ModalType } from '@/constants';
import { useModals, useTrackingEvents } from '@/hooks';
import { ClassName } from '@/styles/constants';

import Payment from '.';

const PaymentModal = () => {
  const [trackingEvents] = useTrackingEvents();

  const { isOpened, data } = useModals(ModalType.PAYMENT);

  React.useEffect(() => {
    if (!isOpened) return;

    trackingEvents.trackUpgradeModal();
  }, [isOpened]);

  return (
    <Modal id={ModalType.PAYMENT} className={`${ClassName.MODAL}--payment`} maxWidth={545} withHeader={false}>
      <Payment focus={data?.focus} />
    </Modal>
  );
};

export default PaymentModal;
