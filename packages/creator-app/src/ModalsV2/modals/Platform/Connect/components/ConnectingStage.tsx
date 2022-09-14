import { Utils } from '@voiceflow/realtime-sdk';
import { Alert, Box, Button, ButtonVariant, LoadCircle, Modal } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { linkGraphic } from '@/assets';
import AmazonLoginButton from '@/components/Forms/AmazonLogin';
import GoogleLoginButton from '@/components/Forms/GoogleLogin';
import { GOOGLE_OAUTH_SCOPES } from '@/constants';
import { getPlatformValue } from '@/utils/platform';

import { PlatformAccount } from '../types';

interface StageMeta {
  title: string;
  projectName: string;
  platformName: string;
}

const getStageMeta = Utils.platform.createPlatformSelector<StageMeta>(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: {
      title: 'connect to amazon',
      projectName: 'skill to Alexa',
      platformName: 'Alexa',
    },
    [VoiceflowConstants.PlatformType.GOOGLE]: {
      title: 'connect to google',
      projectName: 'Action',
      platformName: 'Google',
    },
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: {
      title: 'connect to dialogflow',
      projectName: 'Dialogflow project',
      platformName: 'Dialogflow',
    },
  },
  {
    title: 'connect to project',
    projectName: 'Voiceflow project',
    platformName: 'Voiceflow',
  }
);

interface ConnectingStageProps {
  onClose: VoidFunction;
  platform: VoiceflowConstants.PlatformType;
  onSuccess: (account: PlatformAccount) => void;
}

const ConnectingStage: React.FC<ConnectingStageProps> = ({ onClose, platform, onSuccess }) => {
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const { title, platformName, projectName } = getStageMeta(platform);

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
      <Modal.Header>{title}</Modal.Header>

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

            <Box mt={16}>
              Please connect your <b>{platformName} Developer</b> account to upload your {projectName}.
            </Box>
          </>
        )}

        {error && (
          <Alert variant={Alert.Variant.DANGER} mb={0} mt={8}>
            Login With {platformName} Failed
          </Alert>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Box.Flex gap={12}>
          <Button variant={ButtonVariant.TERTIARY} onClick={onClose}>
            Cancel
          </Button>

          {getPlatformValue(
            platform,
            {
              [VoiceflowConstants.PlatformType.ALEXA]: <AmazonLoginButton disabled={loading} onLoad={onLoad} onFail={onFail} onSuccess={onSuccess} />,
            },
            <GoogleLoginButton scopes={GOOGLE_OAUTH_SCOPES} onLoad={onLoad} onFail={onFail} onSuccess={onSuccess} />
          )}
        </Box.Flex>
      </Modal.Footer>
    </>
  );
};

export default ConnectingStage;
