import { PlatformType } from '@/constants';

import alexaService from './alexa';
import generalService from './general';
import googleService from './google';

const platformServices = {
  alexaService,
  googleService,
  generalService,
};

export const platformServicesMap = {
  [PlatformType.ALEXA]: alexaService,
  [PlatformType.GOOGLE]: googleService,
  [PlatformType.GENERAL]: generalService,
};

export default platformServices;
