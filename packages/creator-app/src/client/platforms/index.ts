import { Constants } from '@voiceflow/general-types';

import { createPlatformSelector } from '@/utils/platform';

import alexa from './alexa';
import general from './general';
import google from './google';

const platformClients = {
  alexa,
  google,
  general,
};

export const getPlatformClient = createPlatformSelector<typeof alexa | typeof google | typeof general>(
  {
    [Constants.PlatformType.ALEXA]: alexa,
    [Constants.PlatformType.GOOGLE]: google,
  },
  general
);

export default platformClients;
