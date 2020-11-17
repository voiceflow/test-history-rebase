import { PlatformType } from '@/constants';

import alexa from './alexa';
import general from './general';
import google from './google';

const platformServices = {
  alexa,
  google,
  general,
};

export const platformServicesMap = {
  [PlatformType.ALEXA]: alexa,
  [PlatformType.GOOGLE]: google,
  [PlatformType.GENERAL]: general,
};

export default platformServices;
