import React from 'react';

import { PlatformType } from '@/constants';
import { createPlatformComponent } from '@/utils/platform';

import AlexaUploadButton from './AlexaUploadButton';
import GoogleUploadButton from './GoogleUploadButton';

const UploadButton = createPlatformComponent('UploadButton', {
  // eslint-disable-next-line react/display-name
  [PlatformType.ALEXA]: () => <AlexaUploadButton />,
  // eslint-disable-next-line react/display-name
  [PlatformType.GOOGLE]: () => <GoogleUploadButton />,
  // eslint-disable-next-line lodash/prefer-constant
  [PlatformType.GENERAL]: () => null,
});

export default UploadButton;
