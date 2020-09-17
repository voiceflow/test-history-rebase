import React from 'react';

import Modal from '@/components/LegacyModal';
import { Permission } from '@/config/permissions';
import { ModalType } from '@/constants';
import { useModals, usePermission } from '@/hooks';
import { ClassName } from '@/styles/constants';

import Payment from '.';

function PaymentModal() {
  const [isAllowed] = usePermission(Permission.UPGRADE_WORKSPACE);

  const { isOpened, toggle, data } = useModals(ModalType.PAYMENT);

  return (
    <Modal className={`${ClassName.MODAL}--payment`} modalname="plan" isOpen={isOpened} toggle={toggle} isAllowed={isAllowed}>
      <Payment focus={data?.focus} />
    </Modal>
  );
}

export default PaymentModal;
