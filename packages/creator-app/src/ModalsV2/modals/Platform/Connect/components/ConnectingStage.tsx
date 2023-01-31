import * as Platform from '@voiceflow/platform-config';
import { Alert, Box, Button, ButtonVariant, LoadCircle, Modal } from '@voiceflow/ui';
import React from 'react';

import { linkGraphic } from '@/assets';
import GoogleLoginButton from '@/components/Forms/GoogleLogin';
import { GOOGLE_OAUTH_SCOPES } from '@/constants';
import { getPlatformValue } from '@/utils/platform';

import { PlatformAccount } from '../types';
import AmazonLoginButton from './AmazonLogin';

interface ConnectingStageProps {
  onClose: VoidFunction;
  platform: Platform.Constants.PlatformType;
  onSuccess: (account: PlatformAccount) => void;
  title: string;
  platformName: string;
  prompt: string | JSX.Element;
}

const ConnectingStage: React.OldFC<ConnectingStageProps> = ({ title, platformName, prompt, onClose, platform, onSuccess }) => {
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onLoad = () => {
    setError(false);
    setLoading(true);
  };

  const onFail = () => {
    setError(true);
    setLoading(false);
  };

  return (
    <>
      <Modal.Header capitalizeText={false} actions={<Modal.Header.CloseButtonAction onClick={onClose} />}>
        {title}
      </Modal.Header>

      <Modal.Body centred>
        {loading ? (
          <>
            <LoadCircle />
            <Box mt={16}>
              Waiting for a verified connection to your <b>{platformName} Developer</b> account.
            </Box>
          </>
        ) : (
          <>
            <img src={linkGraphic} alt="plan restriction" height={80} />

            <Box mt={16}>{prompt}</Box>
          </>
        )}

        {error && (
          <Alert variant={Alert.Variant.DANGER} mt={8}>
            Login With {platformName} Failed
          </Alert>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Box.Flex gap={12}>
          <Button variant={ButtonVariant.TERTIARY} onClick={onClose} squareRadius>
            Cancel
          </Button>

          {getPlatformValue(
            platform,
            {
              [Platform.Constants.PlatformType.ALEXA]: <AmazonLoginButton disabled={loading} onLoad={onLoad} onFail={onFail} onSuccess={onSuccess} />,
            },
            <GoogleLoginButton scopes={GOOGLE_OAUTH_SCOPES} onLoad={onLoad} onFail={onFail} onSuccess={onSuccess} />
          )}
        </Box.Flex>
      </Modal.Footer>
    </>
  );
};

export default ConnectingStage;
