import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { createPlatformSelector } from '@/utils/platform';

import { PlatformModalProps } from './types';

// eslint-disable-next-line import/prefer-default-export
export const getPlatformModalProps = createPlatformSelector<PlatformModalProps>(
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
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES_CHAT]: {
      title: 'connect to dialogflow',
      platformName: 'Dialogflow Chat',
      projectName: 'Dialogflow project',
    },
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES_VOICE]: {
      title: 'connect to dialogflow',
      platformName: 'Dialogflow Voice',
      projectName: 'Dialogflow project',
    },
  },
  {}
);
