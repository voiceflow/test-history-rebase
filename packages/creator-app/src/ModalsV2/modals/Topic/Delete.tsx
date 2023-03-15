import { BlockText, Button, Modal, toast } from '@voiceflow/ui';
import React from 'react';

import * as Diagram from '@/ducks/diagram';
import * as DiagramV2 from '@/ducks/diagramV2';
import { useDispatch, useSelector } from '@/hooks';

import manager from '../../manager';

export interface Props {
  topicID: string;
  domainID: string;
}

const Delete = manager.create<Props>('TopicDelete', () => ({ api, type, opened, hidden, topicID, animated, domainID, closePrevented }) => {
  const topic = useSelector(DiagramV2.diagramByIDSelector, { id: topicID });

  const deleteTopic = useDispatch(Diagram.deleteTopicDiagramForDomain, domainID, topicID);

  const onDelete = async () => {
    try {
      api.preventClose();

      await deleteTopic();

      toast.success(`Successfully deleted "${topic?.name ?? 'Unknown'}" topic.`);

      api.enableClose();
      api.close();
    } catch {
      toast.error('Something went wrong, please contact support if this issue persists.');
      api.enableClose();
    }
  };

  return (
    <Modal type={type} maxWidth={400} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
      <Modal.Header actions={<Modal.Header.CloseButtonAction onClick={api.close} />}>Delete Topic</Modal.Header>

      <Modal.Body>
        <BlockText>Warning, "{topic?.name ?? 'Unknown'}" and all its subtopics will be removed from the assistant.</BlockText>
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
