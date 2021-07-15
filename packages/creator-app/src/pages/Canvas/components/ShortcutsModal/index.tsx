import React from 'react';

import Modal, { ModalBody } from '@/components/Modal';
import { ModalType } from '@/constants';

import { Shortcut } from './components';
import { SHORTCUTS } from './constants';

const ShortcutsModal: React.FC = () => {
  return (
    <Modal id={ModalType.SHORTCUTS} title="Keyboard Shortcuts">
      <ModalBody>
        {SHORTCUTS.map(({ title, command }, index) => (
          <Shortcut key={index} title={title} command={command} />
        ))}
      </ModalBody>
    </Modal>
  );
};

export default ShortcutsModal;
