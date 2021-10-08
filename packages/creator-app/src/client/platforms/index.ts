import { Constants } from '@voiceflow/general-types';

import { createPlatformSelector } from '@/utils/platform';

import alexa from './alexa';
import dialogflow from './dialogflow';
import general from './general';
import google from './google';

type PlatformServices = typeof alexa | typeof google | typeof dialogflow | typeof general;

const platformClients = {
  alexa,
  google,
  dialogflow,
  general,
};

export const getPlatformClient = createPlatformSelector<PlatformServices>(
  {
    [Constants.PlatformType.ALEXA]: alexa,
    [Constants.PlatformType.GOOGLE]: google,
    [Constants.PlatformType.DIALOGFLOW_ES_CHAT]: dialogflow,
    [Constants.PlatformType.DIALOGFLOW_ES_VOICE]: dialogflow,
  },
  general
);

export default platformClients;
