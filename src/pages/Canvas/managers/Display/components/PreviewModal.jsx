import React from 'react';

import Modal, { ModalBody, ModalHeader } from '@/components/LegacyModal';
import { ModalType } from '@/constants';
import { useModals } from '@/hooks';

import DisplayRender from './DisplayRender';

function PaymentModal() {
  const { isOpened, toggle, data } = useModals(ModalType.DISPLAY_PREVIEW);

  const { apl, data: displayData, documentData } = data;

  return (
    <Modal isOpen={isOpened} toggle={toggle}>
      <ModalHeader toggle={toggle} header="Display Preview" />
      <ModalBody className="p-4">
        <DisplayRender apl={documentData} data={displayData} commands={apl} />
      </ModalBody>
    </Modal>
  );
}

export default PaymentModal;
