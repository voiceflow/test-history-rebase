import { Constants } from '@voiceflow/general-types';

import { createPlatformSelector } from '@/utils/platform';

import { PlatformModalProps } from './types';

// eslint-disable-next-line import/prefer-default-export
export const getPlatformModalProps = createPlatformSelector<PlatformModalProps>(
  {
    [Constants.PlatformType.ALEXA]: {
      title: 'connect to amazon',
      platformName: 'Alexa',
      projectName: 'skill to Alexa',
    },
    [Constants.PlatformType.GOOGLE]: {
      title: 'connect to google',
      platformName: 'Google',
      projectName: 'Action',
    },
    [Constants.PlatformType.DIALOGFLOW_ES_CHAT]: {
      title: 'connect to dialogflow',
      platformName: 'Dialogflow Chat',
      projectName: 'Dialogflow project',
    },
    [Constants.PlatformType.DIALOGFLOW_ES_VOICE]: {
      title: 'connect to dialogflow',
      platformName: 'Dialogflow Voice',
      projectName: 'Dialogflow project',
    },
  },
  {}
);
