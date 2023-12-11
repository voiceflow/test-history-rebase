import { BlockText, Box, Button, ButtonVariant, Modal } from '@voiceflow/ui';
import React from 'react';

import manager from '../manager';

export interface Props {
  icon: string;
  header: React.ReactNode;
  message: React.ReactNode;
  maxWidth?: number;
  buttonText?: ButtonVariant;
  buttonVariant?: ButtonVariant;
}

const Success = manager.create<Props>(
  'Success',
  () =>
    ({ api, icon, type, header, opened, message, hidden, maxWidth = 400, animated, buttonText = 'Close', buttonVariant = Button.Variant.TERTIARY }) =>
      (
        <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={maxWidth}>
          <Modal.Header>{header}</Modal.Header>

          <Modal.Body centred>
            <Box as="img" alt="Success" height={80} src={icon} mb={24} />

            <BlockText>{message}</BlockText>
          </Modal.Body>

          <Modal.Footer>
            <Button variant={buttonVariant} onClick={api.onClose} squareRadius>
              {buttonText}
            </Button>
          </Modal.Footer>
        </Modal>
      )
);

export default Success;
