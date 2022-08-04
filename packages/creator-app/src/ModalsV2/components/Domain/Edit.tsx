import { Button, Input, Modal, Toggle, useLinkedState } from '@voiceflow/ui';
import React from 'react';

import manager from '../../manager';

export interface Props {
  domainID: string;
}

const Edit = manager.create<Props>('DomainEdit', () => ({ api, type, opened, hidden, animated }) => {
  const [name, setName] = useLinkedState('');
  const [live, setLive] = useLinkedState(false);

  return (
    <Modal type={type} maxWidth={400} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
      <Modal.Header actions={<Toggle checked={live} size={Toggle.Size.EXTRA_SMALL} onChange={() => setLive(!live)} />}>Edit Domain</Modal.Header>

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

        <Button squareRadius>Save Changes</Button>
      </Modal.Footer>
    </Modal>
  );
});

export default Edit;
