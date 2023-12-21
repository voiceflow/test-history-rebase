import { Text } from '@voiceflow/ui-next';
import pluralize from 'pluralize';
import React from 'react';

import { Modal } from '@/components/Modal';

import manager from '../../../manager';
import { buttonStyles } from './KnowledgeBaseDelete.css';

export interface IKBDeleteModal {
  onDelete: () => Promise<void>;
  numDocuments: number;
}

export const KnowledgeBaseDelete = manager.create<IKBDeleteModal>(
  'KnowledgeBaseDelete',
  () =>
    ({ api, type, opened, hidden, animated, closePrevented, onDelete, numDocuments }) => {
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
        <Modal.Container type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} onEscClose={api.onEscClose}>
          <Modal.Header title={`Delete data ${pluralize('source', numDocuments)} (${numDocuments})`} onClose={api.onClose} />

          <Modal.Body>
            <Text variant="p" color="#1a1e23">
              Deleted data sources won't be recoverable unless you restore a previous agent version. Please confirm that you want to continue.
            </Text>
          </Modal.Body>

          <Modal.Footer>
            <Modal.Footer.Button variant="secondary" label="Cancel" onClick={api.onClose} disabled={closePrevented} />

            <Modal.Footer.Button
              variant="alert"
              label="Delete"
              disabled={closePrevented}
              onClick={onClick}
              isLoading={closePrevented}
              className={buttonStyles}
            />
          </Modal.Footer>
        </Modal.Container>
      );
    }
);
