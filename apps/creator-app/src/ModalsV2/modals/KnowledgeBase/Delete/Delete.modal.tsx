import { Button } from '@voiceflow/ui-next';
import pluralize from 'pluralize';
import React from 'react';

import { Modal } from '@/components/Modal';

import manager from '../../../manager';
import { buttonStyles } from './Delete.css';

export interface Props {
  onDelete: () => Promise<void>;
  numDocuments: number;
}

export const Delete = manager.create<Props>('KBDelete', () => ({ api, type, opened, hidden, animated, closePrevented, onDelete, numDocuments }) => {
  const onClick = async () => {
    try {
      api.preventClose();
      await onDelete();
      api.enableClose();
      api.close();
    } catch {
      api.enableClose();
    }
  };

  return (
    <Modal.Container type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} onEscClose={api.close}>
      <Modal.Header title={`Delete data ${pluralize('source', numDocuments)} (${numDocuments})`} onClose={api.close} />

      <Modal.Body>
        Deleted data sources won't be recoverable unless you restore a previous agent version. Please confirm that you want to continue.
      </Modal.Body>

      <Modal.Footer>
        <Button variant="tertiary" onClick={() => api.close()} disabled={closePrevented}>
          Cancel
        </Button>

        <Button variant="alert" disabled={closePrevented} onClick={onClick} isLoading={closePrevented} className={buttonStyles}>
          {closePrevented ? '' : 'Delete'}
        </Button>
      </Modal.Footer>
    </Modal.Container>
  );
});
