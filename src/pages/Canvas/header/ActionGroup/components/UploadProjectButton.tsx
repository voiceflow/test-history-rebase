import React from 'react';

import { FeatureFlag } from '@/config/features';
import { PlatformType } from '@/constants';
import { useFeature } from '@/hooks';
import { createPlatformComponent } from '@/utils/platform';

import Alexa from './Alexa';
import AlexaUploadButtonV2 from './AlexaUploadButtonV2';
import Google from './Google';

const UploadButton = createPlatformComponent('UploadButton', {
  // eslint-disable-next-line react/display-name
  [PlatformType.ALEXA]: () => {
    const dataRefactor = useFeature(FeatureFlag.DATA_REFACTOR);

    return dataRefactor.isEnabled ? <AlexaUploadButtonV2 /> : <Alexa />;
  },
  [PlatformType.GOOGLE]: Google,
  // eslint-disable-next-line lodash/prefer-constant
  [PlatformType.GENERAL]: () => null,
});

export default UploadButton;
