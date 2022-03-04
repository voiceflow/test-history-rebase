import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { createPlatformSelector } from '@/utils/platform';

import Alexa from './alexa';
import Dialogflow from './dialogflow';
import General from './general';
import Google from './google';
import { PlatformClient } from './types';

// eslint-disable-next-line import/prefer-default-export
export const getPlatformClient = createPlatformSelector<PlatformClient>(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: Alexa.client,
    [VoiceflowConstants.PlatformType.GOOGLE]: Google.client,
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES_CHAT]: Dialogflow.client,
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES_VOICE]: Dialogflow.client,
  },
  General.client
);
