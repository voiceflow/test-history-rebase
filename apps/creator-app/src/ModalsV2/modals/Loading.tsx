import { Modal, Spinner } from '@voiceflow/ui';
import React from 'react';

import manager from '../manager';

const Loading = manager.create('Loading', () => ({ api, type, opened, hidden, animated }) => (
  <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={350} centered>
    <Modal.Body padding="24px !important" textAlign="center">
      <Spinner message="Loading" />
    </Modal.Body>
  </Modal>
));

export default Loading;
