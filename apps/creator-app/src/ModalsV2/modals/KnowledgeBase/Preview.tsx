import { Modal } from '@voiceflow/ui';
import React from 'react';

import manager from '../../manager';

const Preview = manager.create('KBPreview', () => ({ api, type, opened, hidden, animated }) => (
  <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
    <Modal.Header actions={<Modal.Header.CloseButtonAction onClick={api.close} />}>Preview</Modal.Header>

    <Modal.Body centred></Modal.Body>

    <Modal.Footer></Modal.Footer>
  </Modal>
));

export default Preview;
