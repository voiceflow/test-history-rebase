import { Constants } from '@voiceflow/general-types';

import { apiV2 } from './fetch';

const templateClient = {
  getPlatformTemplate: (platform: Constants.PlatformType, tag = 'default') => apiV2.get<string | null>(`templates/${platform}`, { query: { tag } }),
};

export default templateClient;
