import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { apiV2 } from './fetch';

const templateClient = {
  getPlatformTemplate: (platform: VoiceflowConstants.PlatformType, tag = 'default') =>
    apiV2.get<string | null>(`templates/${platform}`, { query: { tag } }),
};

export default templateClient;
