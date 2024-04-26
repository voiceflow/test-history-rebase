import { Button, Input, Modal, Toggle } from '@voiceflow/ui';
import React from 'react';

import Domain from '@/components/Domain';
import * as DomainDuck from '@/ducks/domain';
import { useDispatch, useHotkey, useSelector } from '@/hooks';
import { Hotkey } from '@/keymap';

import manager from '../../manager';

export interface Props {
  domainID: string;
}

const Edit = manager.create<Props>('DomainEdit', () => ({ api, type, opened, hidden, animated, domainID }) => {
  const domain = useSelector(DomainDuck.domainByIDSelector, { id: domainID });
  const rootDomainID = useSelector(DomainDuck.rootDomainIDSelector);

  const patch = useDispatch(DomainDuck.patch);

  const [name, setName] = React.useState(domain?.name ?? '');
  const [live, setLive] = React.useState(domain?.live ?? true);

  const onUpdate = async () => {
    await patch(domainID, { name, live });

    api.close();
  };

  useHotkey(Hotkey.SUBMIT, onUpdate, { preventDefault: true });

  return (
    <Modal type={type} maxWidth={400} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
      <Modal.Header
        actions={
          <Domain.LiveToggleTooltip live={live}>
            <Toggle
              disabled={rootDomainID === domainID}
              checked={live}
              size={Toggle.Size.EXTRA_SMALL}
              onChange={() => setLive(!live)}
            />
          </Domain.LiveToggleTooltip>
        }
      >
        Edit Domain
      </Modal.Header>

      <Modal.Body>
        <Input value={name} autoFocus placeholder="Enter domain name" onChangeText={setName} onEnterPress={onUpdate} />
      </Modal.Body>

      <Modal.Footer gap={12}>
        <Button variant={Button.Variant.TERTIARY} onClick={api.onClose} squareRadius>
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
