import * as Platform from '@voiceflow/platform-config';
import { Utils } from '@voiceflow/realtime-sdk';
import { Box, LoadCircle, Modal } from '@voiceflow/ui';
import React from 'react';

export interface IdleStageProps {
  platform: Platform.Constants.PlatformType;
}

const getStageTitle = Utils.platform.createPlatformSelector<string>(
  {
    [Platform.Constants.PlatformType.ALEXA]: 'connect to amazon',
    [Platform.Constants.PlatformType.GOOGLE]: 'connect to google',
    [Platform.Constants.PlatformType.DIALOGFLOW_ES]: 'connect to dialogflow',
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
