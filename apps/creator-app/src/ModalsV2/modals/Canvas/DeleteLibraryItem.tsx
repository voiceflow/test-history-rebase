import { Button, ButtonVariant, Modal } from '@voiceflow/ui';
import React from 'react';

import manager from '../../manager';

export interface DeleteLibraryItemProps {
  entityName: string;
  entityType: string;
  onConfirm: VoidFunction;
}

const DeleteLibraryItem = manager.create<DeleteLibraryItemProps>(
  'CanvasDeleteLibraryItem',
  () =>
    ({ api, type, opened, hidden, animated, entityName, entityType, onConfirm }) => {
      const onClick = () => {
        onConfirm();
        api.close();
      };

      return (
        <Modal
          type={type}
          opened={opened}
          hidden={hidden}
          animated={animated}
          onExited={api.remove}
          maxWidth={400}
          hideScrollbar
        >
          <Modal.Header actions={<Modal.Header.CloseButtonAction onClick={api.onClose} />}>
            Delete {entityType}
          </Modal.Header>

          <div style={{ padding: '0 32px 32px 32px' }}>
            Warning, “{entityName}” and all its content will be removed from the agent.
          </div>

          <Modal.Footer>
            <Button onClick={api.onClose} variant={ButtonVariant.TERTIARY} squareRadius style={{ marginRight: '10px' }}>
              Cancel
            </Button>
            <Button squareRadius onClick={onClick}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      );
    }
);

export default DeleteLibraryItem;
