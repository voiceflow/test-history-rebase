import { PlatformType } from '@/constants';
import { getPlatformValue } from '@/utils/platform';

import api from './api';
import platfromServices from './platformServices';

const client = {
  ...platfromServices,
  api,
};

export const getPlatformService = (platform: PlatformType) =>
  getPlatformValue(platform, {
    [PlatformType.ALEXA]: client.alexaService,
    // [PlatformType.GOOGLE]: client.googleService,
  });

export default client;
