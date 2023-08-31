import { Button, Input, Modal, toast, useLinkedState } from '@voiceflow/ui';
import React from 'react';

import * as Diagram from '@/ducks/diagramV2';
import { useDispatch, useHotkey } from '@/hooks';
import { Hotkey } from '@/keymap';

import manager from '../../manager';

export interface Props {
  name?: string;
  domainID: string;
}

const Create = manager.create<Props>(
  'TopicCreate',
  () =>
    ({ api, type, name: nameProp = '', opened, hidden, animated, domainID, closePrevented }) => {
      const createTopic = useDispatch(Diagram.createTopicDiagramForDomain, domainID);

      const [name, setName] = useLinkedState(nameProp);

      const onCreate = async () => {
        try {
          api.preventClose();

          const topic = await createTopic({ name });

          toast.success(`Successfully created "${topic.name}" topic.`);

          api.enableClose();
          api.close();
        } catch {
          toast.error('Something went wrong, please contact support if this issue persists.');
          api.enableClose();
        }
      };

      useHotkey(Hotkey.SUBMIT, onCreate, { preventDefault: true });

      return (
        <Modal type={type} maxWidth={400} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
          <Modal.Header actions={<Modal.Header.CloseButtonAction onClick={api.close} />}>Create Topic</Modal.Header>

          <Modal.Body>
            <Input value={name} readOnly={closePrevented} autoFocus placeholder="Enter topic name" onChangeText={setName} onEnterPress={onCreate} />
          </Modal.Body>

          <Modal.Footer gap={12}>
            <Button onClick={() => api.close()} variant={Button.Variant.TERTIARY} disabled={closePrevented} squareRadius>
              Cancel
            </Button>

            <Button onClick={onCreate} disabled={closePrevented} squareRadius>
              Create Topic
            </Button>
          </Modal.Footer>
        </Modal>
      );
    }
);

export default Create;
