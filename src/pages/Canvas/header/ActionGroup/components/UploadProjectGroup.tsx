import React from 'react';

import { PlatformType } from '@/constants';
import { platformAware } from '@/hocs';

import AlexaUploadGroup from './AlexaUploadGroup';
import GoogleUploadGroup from './GoogleUploadGroup';

const UploadGroup = platformAware(
  {
    [PlatformType.ALEXA]: () => <AlexaUploadGroup />,
    [PlatformType.GOOGLE]: () => <GoogleUploadGroup />,
  },
  () => null
);

export default UploadGroup;
