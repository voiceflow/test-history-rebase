import type * as Platform from '@voiceflow/platform-config';

import { apiV2 } from './fetch';

const templateClient = {
  getPlatformTemplate: (platform: Platform.Constants.PlatformType | Platform.Constants.NLUType, tag = 'default') =>
    apiV2.get<string | null>(`templates/${platform}`, { query: { tag } }),
};

export default templateClient;
