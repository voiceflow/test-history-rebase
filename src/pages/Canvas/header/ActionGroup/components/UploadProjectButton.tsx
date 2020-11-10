import React from 'react';

import { PlatformType } from '@/constants';
import { createPlatformComponent } from '@/utils/platform';

import AlexaUploadButtonV2 from './AlexaUploadButtonV2';
import GoogleUploadButtonV2 from './GoogleUploadButtonV2';

const UploadButton = createPlatformComponent('UploadButton', {
  // eslint-disable-next-line react/display-name
  [PlatformType.ALEXA]: () => <AlexaUploadButtonV2 />,
  // eslint-disable-next-line react/display-name
  [PlatformType.GOOGLE]: () => <GoogleUploadButtonV2 />,
  // eslint-disable-next-line lodash/prefer-constant
  [PlatformType.GENERAL]: () => null,
});

export default UploadButton;
