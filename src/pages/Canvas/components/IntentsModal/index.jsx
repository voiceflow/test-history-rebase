import React from 'react';

import Modal from '@/components/Modal';
import { MODALS } from '@/constants';

import IntentsManager from './IntentsManager';

function IntentsModal() {
  return (
    <Modal id={MODALS.INTENTS} title="intents" isSmall={false}>
      <IntentsManager />
    </Modal>
  );
}

export default IntentsModal;
