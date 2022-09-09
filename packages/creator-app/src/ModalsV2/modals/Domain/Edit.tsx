import { Button, Input, Modal, Toggle, useLinkedState } from '@voiceflow/ui';
import React from 'react';

import Domains from '@/components/Domains';
import * as Domain from '@/ducks/domain';
import { useDispatch, useHotKeys, useSelector } from '@/hooks';
import { Hotkey } from '@/keymap';

import manager from '../../manager';

export interface Props {
  domainID: string;
}

const Edit = manager.create<Props>('DomainEdit', () => ({ api, type, opened, hidden, animated, domainID }) => {
  const domain = useSelector(Domain.domainByIDSelector, { id: domainID });
  const rootDomainID = useSelector(Domain.rootDomainIDSelector);

  const patch = useDispatch(Domain.patch);

  const [name, setName] = useLinkedState(domain?.name ?? '');
  const [live, setLive] = useLinkedState(domain?.live ?? true);

  const onUpdate = async () => {
    await patch(domainID, { name, live });

    api.close();
  };

  useHotKeys(Hotkey.SUBMIT, onUpdate, { preventDefault: true });

  return (
    <Modal type={type} maxWidth={400} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
      <Modal.Header
        actions={
          <Domains.LiveToggleTooltip live={live}>
            <Toggle disabled={rootDomainID === domainID} checked={live} size={Toggle.Size.EXTRA_SMALL} onChange={() => setLive(!live)} />
          </Domains.LiveToggleTooltip>
        }
      >
        Edit Domain
      </Modal.Header>

      <Modal.Body>
        <Input value={name} autoFocus placeholder="Enter domain name" onChangeText={setName} onEnterPress={onUpdate} />
      </Modal.Body>

      <Modal.Footer gap={12}>
        <Button variant={Button.Variant.TERTIARY} onClick={() => api.close()} squareRadius>
          Cancel
        </Button>

        <Button onClick={onUpdate} squareRadius>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default Edit;
