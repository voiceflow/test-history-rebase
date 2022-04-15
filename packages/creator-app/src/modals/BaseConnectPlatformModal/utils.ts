import { Utils } from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { PlatformModalProps } from './types';

export const getPlatformModalProps = Utils.platform.createPlatformSelector<PlatformModalProps>(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: {
      title: 'connect to amazon',
      platformName: 'Alexa',
      projectName: 'skill to Alexa',
    },
    [VoiceflowConstants.PlatformType.GOOGLE]: {
      title: 'connect to google',
      platformName: 'Google',
      projectName: 'Action',
    },
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: {
      title: 'connect to dialogflow',
      platformName: 'Dialogflow',
      projectName: 'Dialogflow project',
    },
  },
  {}
);
