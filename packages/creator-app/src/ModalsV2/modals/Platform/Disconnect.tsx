import { Button, ButtonVariant, Modal } from '@voiceflow/ui';
import React from 'react';

import manager from '../../manager';

export interface BaseDisconnectProps {
  title: string;
  text: string;
}

const Disconnect = manager.create<BaseDisconnectProps>('AccountDisconnect', () => ({ api, type, opened, hidden, animated, title, text }) => {
  const onDisconnect = () => {
    api.resolve();
    api.close();
  };

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={400}>
      <Modal.Header actions={<Modal.Header.CloseButtonAction onClick={() => api.close()} />}>{title}</Modal.Header>

      <Modal.Body>{text}</Modal.Body>

      <Modal.Footer gap={12}>
        <Button variant={ButtonVariant.TERTIARY} onClick={() => api.close()} squareRadius>
          Cancel
        </Button>

        <Button onClick={onDisconnect}>Disconnect</Button>
      </Modal.Footer>
    </Modal>
  );
});

export default Disconnect;
