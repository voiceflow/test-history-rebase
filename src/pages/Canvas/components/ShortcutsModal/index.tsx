import React from 'react';

import Box from '@/components/Box';
import Button, { ButtonVariant } from '@/components/Button';
import Modal, { ModalBody, ModalFooter } from '@/components/Modal';
import { ModalType } from '@/constants';
import { useModals } from '@/hooks';

import { Shortcut } from './components';
import { SHORTCUTS } from './constants';

function ShortcutsModal() {
  const { close } = useModals(ModalType.SHORTCUTS);

  return (
    <Modal id={ModalType.SHORTCUTS} title="Keyboard Shortcuts">
      <Box width="100%">
        <ModalBody>
          {SHORTCUTS.map(({ title, command }, index) => (
            <Shortcut key={index} title={title} command={command} />
          ))}
        </ModalBody>

        <ModalFooter>
          <Button variant={ButtonVariant.TERTIARY} onClick={close}>
            Close
          </Button>
        </ModalFooter>
      </Box>
    </Modal>
  );
}

export default ShortcutsModal;
