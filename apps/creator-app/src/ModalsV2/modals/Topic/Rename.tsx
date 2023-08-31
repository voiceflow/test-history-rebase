import { Button, Input, Modal, toast } from '@voiceflow/ui';
import React from 'react';

import * as DiagramV2 from '@/ducks/diagramV2';
import { useDispatch, useHotkey, useSelector } from '@/hooks';
import { Hotkey } from '@/keymap';

import manager from '../../manager';

export interface Props {
  topicID: string;
}

const Rename = manager.create<Props>('TopicRename', () => ({ api, type, opened, hidden, animated, topicID, closePrevented }) => {
  const topic = useSelector(DiagramV2.diagramByIDSelector, { id: topicID });

  const renameDiagram = useDispatch(DiagramV2.renameDiagram, topicID);

  const [name, setName] = React.useState(topic?.name ?? '');

  const onRename = async () => {
    try {
      api.preventClose();

      await renameDiagram(name);

      api.enableClose();
      api.close();
    } catch {
      toast.error('Something went wrong, please contact support if this issue persists.');
      api.enableClose();
    }
  };

  useHotkey(Hotkey.SUBMIT, onRename, { preventDefault: true });

  return (
    <Modal type={type} maxWidth={400} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
      <Modal.Header actions={<Modal.Header.CloseButtonAction onClick={api.close} />}>Rename Topic</Modal.Header>

      <Modal.Body>
        <Input value={name} readOnly={closePrevented} autoFocus placeholder="Enter topic name" onChangeText={setName} onEnterPress={onRename} />
      </Modal.Body>

      <Modal.Footer gap={12}>
        <Button onClick={() => api.close()} variant={Button.Variant.TERTIARY} disabled={closePrevented} squareRadius>
          Cancel
        </Button>

        <Button onClick={onRename} disabled={closePrevented} squareRadius>
          Rename
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default Rename;
