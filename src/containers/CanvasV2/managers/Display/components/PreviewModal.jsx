import React from 'react';

import Modal, { ModalBody, ModalHeader } from '@/components/Modal';
import { MODALS } from '@/constants';
import { useModals } from '@/contexts/ModalsContext';

import DisplayRender from './DisplayRender';

function PaymentModal() {
  const { isOpened, toggle, data } = useModals(MODALS.DISPLAY_PREVIEW);

  const { apl, data: displayData } = data;
  return (
    <Modal isOpen={isOpened} toggle={toggle}>
      <ModalHeader toggle={toggle} header="Display Preview" />
      <ModalBody className="p-4">
        <DisplayRender apl={apl} data={displayData} />
      </ModalBody>
    </Modal>
  );
}

export default PaymentModal;
