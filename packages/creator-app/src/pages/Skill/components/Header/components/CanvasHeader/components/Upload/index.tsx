import React from 'react';

import { PlatformType } from '@/constants';
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
