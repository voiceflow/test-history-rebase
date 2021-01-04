import React from 'react';

import DisplayRenderer from '@/components/DisplayRenderer';
import Modal, { ModalBody, ModalHeader } from '@/components/LegacyModal';
import { ModalType } from '@/constants';
import { useModals } from '@/hooks';

function PaymentModal() {
  const { isOpened, toggle, data } = useModals(ModalType.DISPLAY_PREVIEW);

  const { apl, data: displayData, documentData } = data;

  return (
    <Modal isOpen={isOpened} toggle={toggle}>
      <ModalHeader toggle={toggle} header="Display Preview" />
      <ModalBody className="p-4">
        <DisplayRenderer apl={documentData} data={displayData} commands={apl} withControls />
      </ModalBody>
    </Modal>
  );
}

export default PaymentModal;
