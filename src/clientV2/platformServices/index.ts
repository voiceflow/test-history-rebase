import { PlatformType } from '@/constants';

import alexaService from './alexa';
import googleService from './google';

const platformServices = {
  alexaService,
  googleService,
};

export const platformServicesMap = {
  [PlatformType.ALEXA]: alexaService,
  [PlatformType.GOOGLE]: googleService,
  [PlatformType.GENERAL]: null,
};

export default platformServices;
