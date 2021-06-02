import React from 'react';

import DisplayRenderer from '@/components/DisplayRenderer';
import Modal, { ModalBody, ModalHeader } from '@/components/LegacyModal';
import { ModalType } from '@/constants';
import { useModals } from '@/hooks';

const AnyModal = Modal as any;

const APLPreviewModal: React.FC = () => {
  const { isOpened, toggle, data } = useModals<{ apl?: string; displayData?: string; commands?: string }>(ModalType.APL_PREVIEW);

  const { apl, displayData, commands } = data;

  return (
    <AnyModal isOpen={isOpened} toggle={toggle}>
      <ModalHeader toggle={toggle} header="Display Preview" />

      <ModalBody className="p-4">
        <DisplayRenderer apl={apl} data={displayData} commands={commands} withControls />
      </ModalBody>
    </AnyModal>
  );
};

export default APLPreviewModal;
