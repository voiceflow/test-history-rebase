import { Constants } from '@voiceflow/general-types';
import React from 'react';

import { platformAware } from '@/hocs';

import Alexa from './Alexa';
import Dialogflow from './Dialogflow';
import Google from './Google';

const UploadGroup = platformAware(
  {
    [Constants.PlatformType.ALEXA]: () => <Alexa />,
    [Constants.PlatformType.GOOGLE]: () => <Google />,
    [Constants.PlatformType.DIALOGFLOW_ES_CHAT]: () => <Dialogflow />,
    [Constants.PlatformType.DIALOGFLOW_ES_VOICE]: () => <Dialogflow />,
  },
  () => null
);

export default UploadGroup;
