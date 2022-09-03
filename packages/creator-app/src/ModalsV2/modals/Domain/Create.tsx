import { Button, Input, Modal, toast, Toggle, useLinkedState } from '@voiceflow/ui';
import React from 'react';

import Domains from '@/components/Domains';
import * as Domain from '@/ducks/domain';
import { useDispatch } from '@/hooks';

import manager from '../../manager';

export interface Props {
  name: string;
  live?: boolean;
}

const Create = manager.create<Props>(
  'DomainCreate',
  () =>
    ({ api, type, name: nameProp, live: liveProp = true, opened, hidden, animated, closePrevented }) => {
      const createDomain = useDispatch(Domain.create);

      const [name, setName] = useLinkedState(nameProp);
      const [live, setLive] = useLinkedState(liveProp);

      const onCreate = async () => {
        try {
          api.preventClose();

          await createDomain({ name, live }, { navigateToDomain: true });

          toast.success(`Successfully created "${name}" domain.`);

          api.enableClose();
          api.close();
        } catch {
          toast.error('Something went wrong, please contact support if this issue persists.');
          api.enableClose();
        }
      };

      return (
        <Modal type={type} maxWidth={400} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
          <Modal.Header
            actions={
              <Domains.LiveToggleTooltip live={live}>
                <Toggle size={Toggle.Size.EXTRA_SMALL} checked={live} disabled={closePrevented} onChange={() => setLive(!live)} />
              </Domains.LiveToggleTooltip>
            }
          >
            Create Domain
          </Modal.Header>

          <Modal.Body>
            <Input value={name} readOnly={closePrevented} autoFocus placeholder="Enter domain name" onChangeText={setName} />
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
