import React from 'react';

import DisplayRenderer from '@/components/DisplayRenderer';
import Modal, { ModalBody } from '@/components/Modal';
import { ModalType } from '@/constants';
import { useModals } from '@/hooks';

const APLPreviewModal: React.FC = () => {
  const { data } = useModals<{ apl?: string; displayData?: string; commands?: string }>(ModalType.APL_PREVIEW);

  const { apl, displayData, commands } = data;

  return (
    <Modal id={ModalType.APL_PREVIEW} title="Display Preview">
      <ModalBody>
        <DisplayRenderer apl={apl} data={displayData} commands={commands} withControls />
      </ModalBody>
    </Modal>
  );
};

export default APLPreviewModal;
