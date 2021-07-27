import { PlatformType } from '@voiceflow/internal';
import React from 'react';

import { platformAware } from '@/hocs';

import { Alexa, Google } from './components';

const UploadGroup = platformAware(
  {
    [PlatformType.ALEXA]: () => <Alexa />,
    [PlatformType.GOOGLE]: () => <Google />,
  },
  () => null
);

export default UploadGroup;
