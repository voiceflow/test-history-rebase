import { Button, Input, Modal, Toggle, useLinkedState } from '@voiceflow/ui';
import React from 'react';

import manager from '../../manager';

export interface Props {
  name: string;
  live?: boolean;
}

const Create = manager.create<Props>('DomainCreate', () => ({ api, type, name: nameProps, live: liveProp = true, opened, hidden, animated }) => {
  const [name, setName] = useLinkedState(nameProps);
  const [live, setLive] = useLinkedState(liveProp);

  return (
    <Modal type={type} maxWidth={400} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
      <Modal.Header actions={<Toggle checked={live} size={Toggle.Size.EXTRA_SMALL} onChange={() => setLive(!live)} />}>Create Domain</Modal.Header>

      <Modal.Body>
        <Input
          value={name}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          placeholder="Enter domain name"
          onChangeText={setName}
        />
      </Modal.Body>

      <Modal.Footer gap={12}>
        <Button variant={Button.Variant.TERTIARY} onClick={() => api.close()} squareRadius>
          Cancel
        </Button>

        <Button squareRadius>Create Domain</Button>
      </Modal.Footer>
    </Modal>
  );
});

export default Create;
