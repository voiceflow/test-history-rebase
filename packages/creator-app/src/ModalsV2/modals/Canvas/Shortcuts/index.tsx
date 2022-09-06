import { Modal } from '@voiceflow/ui';
import React from 'react';

import manager from '../../../manager';
import { Shortcut } from './components';
import { SHORTCUTS } from './constants';

const Shortcuts = manager.create('Shortcuts', () => ({ api, type, opened, hidden, animated }) => (
  <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
    <Modal.Header>Keyboard Shortcuts</Modal.Header>

    <Modal.Body>
      {SHORTCUTS.map(({ title, command }, index) => (
        <Shortcut key={index} title={title} command={command} />
      ))}
    </Modal.Body>
  </Modal>
));

export default Shortcuts;
