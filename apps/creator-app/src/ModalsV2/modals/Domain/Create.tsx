import { Button, Input, Modal, Toggle, useLinkedState } from '@voiceflow/ui';
import { toast } from '@voiceflow/ui-next';
import React from 'react';

import Domain from '@/components/Domain';
import * as DomainDuck from '@/ducks/domain';
import { useDispatch, useHotkey } from '@/hooks';
import { Hotkey } from '@/keymap';

import manager from '../../manager';

export interface Props {
  name: string;
  live?: boolean;
}

const Create = manager.create<Props>(
  'DomainCreate',
  () =>
    ({ api, type, name: nameProp, live: liveProp = true, opened, hidden, animated, closePrevented }) => {
      const createDomain = useDispatch(DomainDuck.create);

      const [name, setName] = useLinkedState(nameProp);
      const [live, setLive] = useLinkedState(liveProp);

      const onCreate = async () => {
        try {
          api.preventClose();

          const domain = await createDomain({ name, live }, { navigateToDomain: true });

          toast.success(`Successfully created "${domain.name}" domain.`);

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
          <Modal.Header
            actions={
              <Domain.LiveToggleTooltip live={live}>
                <Toggle size={Toggle.Size.EXTRA_SMALL} checked={live} disabled={closePrevented} onChange={() => setLive(!live)} />
              </Domain.LiveToggleTooltip>
            }
          >
            Create Domain
          </Modal.Header>

          <Modal.Body>
            <Input value={name} readOnly={closePrevented} autoFocus placeholder="Enter domain name" onChangeText={setName} onEnterPress={onCreate} />
          </Modal.Body>

          <Modal.Footer gap={12}>
            <Button onClick={() => api.close()} variant={Button.Variant.TERTIARY} disabled={closePrevented} squareRadius>
              Cancel
            </Button>

            <Button onClick={onCreate} disabled={closePrevented} squareRadius>
              Create Domain
            </Button>
          </Modal.Footer>
        </Modal>
      );
    }
);

export default Create;
