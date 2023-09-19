import { BlockText, Button, Modal } from '@voiceflow/ui';
import { toast } from '@voiceflow/ui-next';

import React from 'react';

import * as Domain from '@/ducks/domain';
import { useDispatch, useSelector } from '@/hooks';

import manager from '../../manager';

export interface Props {
  domainID: string;
}

const Delete = manager.create<Props>('DomainDelete', () => ({ api, type, opened, hidden, animated, domainID, closePrevented }) => {
  const domain = useSelector(Domain.domainByIDSelector, { id: domainID });

  const deleteWithANewVersion = useDispatch(Domain.deleteWithANewVersion, domainID);

  const onDelete = async () => {
    try {
      api.preventClose();

      await deleteWithANewVersion();

      toast.success(`Successfully deleted "${domain?.name ?? 'Unknown'}" domain.`);

      api.enableClose();
      api.close();
    } catch {
      toast.error('Something went wrong, please contact support if this issue persists.');
      api.enableClose();
    }
  };

  return (
    <Modal type={type} maxWidth={400} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
      <Modal.Header actions={<Modal.Header.CloseButtonAction onClick={api.close} />}>Delete Domain</Modal.Header>

      <Modal.Body>
        <BlockText>Warning, "{domain?.name ?? 'Unknown'}" and all its content will be removed from the assistant.</BlockText>
      </Modal.Body>

      <Modal.Footer gap={12}>
        <Button variant={Button.Variant.TERTIARY} onClick={() => api.close()} squareRadius disabled={closePrevented}>
          Cancel
        </Button>

        <Button onClick={onDelete} squareRadius disabled={closePrevented}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default Delete;
