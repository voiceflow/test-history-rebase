import { Utils } from '@voiceflow/realtime-sdk';
import { Box, LoadCircle, Modal } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

export interface IdleStageProps {
  platform: VoiceflowConstants.PlatformType;
}

const getStageTitle = Utils.platform.createPlatformSelector<string>(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: 'connect to amazon',
    [VoiceflowConstants.PlatformType.GOOGLE]: 'connect to google',
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: 'connect to dialogflow',
  },
  'connect to voiceflow'
);

const IdleStage: React.FC<IdleStageProps> = ({ platform }) => (
  <>
    <Modal.Header>{getStageTitle(platform)}</Modal.Header>

    <Box width="100%">
      <Modal.Body centred>
        <LoadCircle />
      </Modal.Body>
    </Box>
  </>
);

export default IdleStage;
