import { Text } from '@voiceflow/ui-next';
import React from 'react';

import { Modal } from '@/components/Modal';

import manager from '../../manager';
import { IConformV2Modal } from './ConfirmV2.interface';

export const ConfirmV2Modal = manager.create<IConformV2Modal>(
  'ConfirmV2',
  () =>
    ({
      api,
      type,
      body,
      title,
      opened,
      hidden,
      confirm,
      animated,
      closePrevented,
      cancelButtonLabel = 'Cancel',
      cancelButtonVariant = 'secondary',
      confirmButtonLabel = 'Confirm',
      confirmButtonVariant = 'primary',
    }) => {
      const onConfirm = async () => {
        try {
          api.preventClose();

          await confirm?.();

          api.resolve();
          api.enableClose();
          api.close();
        } catch {
          api.enableClose();
        }
      };

      return (
        <Modal.Container
          type={type}
          opened={opened}
          hidden={hidden}
          animated={animated}
          onExited={api.remove}
          onEscClose={api.onEscClose}
          onEnterSubmit={onConfirm}
        >
          <Modal.Header title={title} onClose={api.onClose} />

          <Modal.Body pt={16} pb={16}>
            {typeof body === 'string' ? <Text>{body}</Text> : body}
          </Modal.Body>

          <Modal.Footer>
            {cancelButtonLabel !== null && (
              <Modal.Footer.Button label={cancelButtonLabel} variant={cancelButtonVariant} onClick={api.onClose} disabled={closePrevented} />
            )}

            <Modal.Footer.Button
              label={confirmButtonLabel}
              onClick={onConfirm}
              variant={confirmButtonVariant}
              isLoading={closePrevented}
              disabled={closePrevented}
            />
          </Modal.Footer>
        </Modal.Container>
      );
    }
);
