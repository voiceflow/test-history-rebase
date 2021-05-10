import React from 'react';

import { PlatformType } from '@/constants';
import { createPlatformComponent } from '@/utils/platform';

import AlexaUploadGroup from './AlexaUploadGroup';
import GoogleUploadGroup from './GoogleUploadGroup';

const UploadGroup = createPlatformComponent(
  'UploadGroup',
  {
    // eslint-disable-next-line react/display-name
    [PlatformType.ALEXA]: () => <AlexaUploadGroup />,
    // eslint-disable-next-line react/display-name
    [PlatformType.GOOGLE]: () => <GoogleUploadGroup />,
  },
  () => null
);

export default UploadGroup;
