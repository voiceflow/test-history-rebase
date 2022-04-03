import { Utils } from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import Alexa from './alexa';
import Dialogflow from './dialogflow';
import General from './general';
import Google from './google';
import { PlatformClient } from './types';

// eslint-disable-next-line import/prefer-default-export
export const getPlatformClient = Utils.platform.createPlatformSelector<PlatformClient>(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: Alexa.client,
    [VoiceflowConstants.PlatformType.GOOGLE]: Google.client,
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: Dialogflow.client,
  },
  General.client
);
