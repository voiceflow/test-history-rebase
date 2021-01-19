import React from 'react';

import Modal from '@/components/LegacyModal';
import { Permission } from '@/config/permissions';
import { ModalType } from '@/constants';
import { useModals, usePermission, useTrackingEvents } from '@/hooks';
import { ClassName } from '@/styles/constants';

import Payment from '.';

const PaymentModal = () => {
  const [isAllowed] = usePermission(Permission.UPGRADE_WORKSPACE);
  const [trackingEvents] = useTrackingEvents();

  const { isOpened, toggle, data } = useModals(ModalType.PAYMENT);

  React.useEffect(() => {
    if (!isOpened) return;

    trackingEvents.trackUpgradeModal();
  }, [isOpened]);

  return (
    <Modal className={`${ClassName.MODAL}--payment`} modalname="plan" isOpen={isOpened} toggle={toggle} notAllowed={!isAllowed}>
      <Payment focus={data?.focus} />
    </Modal>
  );
};

export default PaymentModal;
