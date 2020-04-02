import React from 'react';

import Modal from '@/components/Modal';
import { ModalType } from '@/constants';

import IntentsManager from './IntentsManager';

function IntentsModal() {
  return (
    <Modal id={ModalType.INTENTS} title="intents" isSmall={false}>
      <IntentsManager />
    </Modal>
  );
}

export default IntentsModal;
