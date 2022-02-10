import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

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
    [VoiceflowConstants.PlatformType.ALEXA]: alexa,
    [VoiceflowConstants.PlatformType.GOOGLE]: google,
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES_CHAT]: dialogflow,
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES_VOICE]: dialogflow,
  },
  general
);

export default platformClients;
