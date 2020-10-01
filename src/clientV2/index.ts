import { PlatformType } from '@/constants';
import { getPlatformValue } from '@/utils/platform';

import api from './api';
import platformServices, { platformServicesMap } from './platformServices';

const client = {
  ...platformServices,
  api,
};

export const getPlatformService = <T extends PlatformType>(platform: T) =>
  (getPlatformValue<any>(platform, platformServicesMap) as typeof platformServicesMap[T])!;

export default client;
