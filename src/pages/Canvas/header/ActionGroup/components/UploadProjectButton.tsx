import React from 'react';

import { FeatureFlag } from '@/config/features';
import { PlatformType } from '@/constants';
import { useFeature } from '@/hooks';
import { createPlatformComponent } from '@/utils/platform';

import Alexa from './Alexa';
import AlexaUploadButtonV2 from './AlexaUploadButtonV2';
import Google from './Google';
import GoogleUploadButtonV2 from './GoogleUploadButtonV2';

const UploadButton = createPlatformComponent('UploadButton', {
  // eslint-disable-next-line react/display-name
  [PlatformType.ALEXA]: () => {
    const dataRefactor = useFeature(FeatureFlag.DATA_REFACTOR);

    return dataRefactor.isEnabled ? <AlexaUploadButtonV2 /> : <Alexa />;
  },
  // eslint-disable-next-line react/display-name
  [PlatformType.GOOGLE]: () => {
    const dataRefactor = useFeature(FeatureFlag.DATA_REFACTOR);

    return dataRefactor.isEnabled ? <GoogleUploadButtonV2 /> : <Google />;
  },
  // eslint-disable-next-line lodash/prefer-constant
  [PlatformType.GENERAL]: () => null,
});

export default UploadButton;
