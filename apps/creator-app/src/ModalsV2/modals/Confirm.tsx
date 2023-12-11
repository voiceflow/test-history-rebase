import { Button, Modal } from '@voiceflow/ui';
import React from 'react';

import manager from '../manager';

export interface Props {
  body?: React.ReactNode;
  header?: React.ReactNode;
  confirm?: () => void | Promise<void>;
  maxWidth?: number;
  centered?: boolean;
  cancelButtonText?: React.ReactNode;
  confirmButtonText: React.ReactNode;
}

/**
 * @deprecated use ConfirmV2 instead
 */
const Confirm = manager.create<Props>(
  'Confirm',
  () =>
    ({
      api,
      type,
      body,
      header,
      opened,
      hidden,
      confirm,
      maxWidth = 400,
      centered = false,
      animated,
      closePrevented,
      cancelButtonText = 'Cancel',
      confirmButtonText,
    }) => {
      const onConfirm = async () => {
        try {
          api.preventClose();

          await confirm?.();

          api.enableClose();
          api.close();
        } catch {
          api.enableClose();
        }
      };

      return (
        <Modal type={type} opened={opened} hidden={hidden} centered={centered} animated={animated} onExited={api.remove} maxWidth={maxWidth}>
          {header && <Modal.Header actions={<Modal.Header.CloseButtonAction onClick={api.onClose} />}>{header}</Modal.Header>}

          <Modal.Body>{body}</Modal.Body>

          <Modal.Footer gap={12}>
            {cancelButtonText && (
              <Button variant={Button.Variant.TERTIARY} onClick={api.onClose} squareRadius>
                {cancelButtonText}
              </Button>
            )}

            <Button variant={Button.Variant.PRIMARY} disabled={closePrevented} onClick={onConfirm} squareRadius>
              {confirmButtonText}
            </Button>
          </Modal.Footer>
        </Modal>
      );
    }
);

export default Confirm;
