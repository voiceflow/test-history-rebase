import * as Platform from '@voiceflow/platform-config';
import { Button, ButtonVariant, Modal } from '@voiceflow/ui';
import React from 'react';

import manager from '../../manager';

export interface BaseDisconnectProps {
  platform: Platform.Constants.PlatformType;
}

const Disconnect = manager.create<BaseDisconnectProps>(
  'AccountDisconnect',
  () =>
    ({ api, type, opened, hidden, animated, platform }) => {
      const platformConfig = Platform.Config.get(platform);

      const onDisconnect = () => {
        api.resolve();
        api.close();
      };

      return (
        <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={400}>
          <Modal.Header actions={<Modal.Header.CloseButtonAction onClick={api.onClose} />}>
            {platformConfig.integration.disconnectTitle}
          </Modal.Header>

          <Modal.Body>{platformConfig.integration.disconnectDescription}</Modal.Body>

          <Modal.Footer gap={12}>
            <Button variant={ButtonVariant.TERTIARY} onClick={api.onClose} squareRadius>
              Cancel
            </Button>

            <Button onClick={onDisconnect}>Disconnect</Button>
          </Modal.Footer>
        </Modal>
      );
    }
);

export default Disconnect;
