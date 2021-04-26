import { PlatformType } from '@/constants';

import alexa from './alexa';
import general from './general';
import google from './google';

const platformServices = {
  alexa,
  google,
  general,
  mobile_app: general,
  ivr: general,
  chatbot: general,
};

export const platformServicesMap = {
  [PlatformType.ALEXA]: alexa,
  [PlatformType.GOOGLE]: google,
  [PlatformType.GENERAL]: general,
  [PlatformType.MOBILE_APP]: general,
  [PlatformType.IVR]: general,
  [PlatformType.CHATBOT]: general,
};

export default platformServices;
