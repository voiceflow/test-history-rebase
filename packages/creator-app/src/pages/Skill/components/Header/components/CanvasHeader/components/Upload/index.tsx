import { Constants } from '@voiceflow/general-types';
import React from 'react';

import { platformAware } from '@/hocs';

import { Alexa, Google } from './components';

const UploadGroup = platformAware(
  {
    [Constants.PlatformType.ALEXA]: () => <Alexa />,
    [Constants.PlatformType.GOOGLE]: () => <Google />,
  },
  () => null
);

export default UploadGroup;
