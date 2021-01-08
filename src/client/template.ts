import { PlatformType } from '@/constants';

import { apiV2 } from './fetch';

const templateClient = {
  getPlatformTemplate: (platform: PlatformType, tag = 'default') => apiV2.get<string | null>(`templates/${platform}`, { query: { tag } }),
};

export default templateClient;
