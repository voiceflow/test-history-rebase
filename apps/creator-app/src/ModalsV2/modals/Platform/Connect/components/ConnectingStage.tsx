import { datadogRum } from '@datadog/browser-rum';
import * as Platform from '@voiceflow/platform-config';
import { Box, Button, ButtonVariant, LoadCircle, Modal } from '@voiceflow/ui';
import React from 'react';

import { linkGraphic } from '@/assets';
import Alert from '@/components/Alert';

import { PlatformAccount } from '../types';

interface ConnectingStageProps {
  onClose: VoidFunction;
  onSuccess: (account: PlatformAccount) => void;
  platformConfig: Platform.Base.Config;
}

const ConnectingStage: React.FC<ConnectingStageProps> = ({ onClose, onSuccess, platformConfig }) => {
  const [error, setError] = React.useState(false);
  const [connecting, setConnecting] = React.useState(false);

  const onLoad = () => {
    setError(false);
    setConnecting(true);
  };

  const onError = (error: unknown) => {
    datadogRum.addError(error);

    setError(true);
    setConnecting(false);
  };

  return (
    <>
      <Modal.Header capitalizeText={false} actions={<Modal.Header.CloseButtonAction onClick={onClose} />}>
        {platformConfig.integration.connectTitle}
      </Modal.Header>

      <Modal.Body centred>
        {connecting ? (
          <>
            <LoadCircle />
            <Box mt={16}>
              Waiting for a verified connection to your <b>{platformConfig.name} Developer</b> account.
            </Box>
          </>
        ) : (
          <>
            <img src={linkGraphic} alt="plan restriction" height={80} />

            <Box mt={16}>{platformConfig.integration.connectDescription}</Box>
          </>
        )}

        {error && (
          <Alert variant={Alert.Variant.DANGER} mt={8}>
            Login With {platformConfig.name} Failed
          </Alert>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Box.Flex gap={12}>
          <Button variant={ButtonVariant.TERTIARY} onClick={onClose} squareRadius>
            Cancel
          </Button>

          <platformConfig.integration.linkAccountButton.Component onClick={onLoad} onError={onError} disabled={connecting} onSuccess={onSuccess} />
        </Box.Flex>
      </Modal.Footer>
    </>
  );
};

export default ConnectingStage;
