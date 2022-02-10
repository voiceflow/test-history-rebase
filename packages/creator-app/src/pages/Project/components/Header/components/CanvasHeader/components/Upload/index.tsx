import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { platformAware } from '@/hocs';

import Alexa from './Alexa';
import Dialogflow from './Dialogflow';
import Google from './Google';

const UploadGroup = platformAware(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: () => <Alexa />,
    [VoiceflowConstants.PlatformType.GOOGLE]: () => <Google />,
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES_CHAT]: () => <Dialogflow />,
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES_VOICE]: () => <Dialogflow />,
  },
  () => null
);

export default UploadGroup;
