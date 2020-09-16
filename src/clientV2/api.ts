import Voiceflow from '@voiceflow/api-sdk';
import axios from 'axios';

import { API_ENDPOINT } from '@/config';
import { PlatformType } from '@/constants';

export const voiceflow = new Voiceflow({
  clientKey: 'CREATOR_APP',
  apiEndpoint: `${API_ENDPOINT}/v2`,
});

const creatorAPI = {
  template: {
    getPlatformTemplate: (platform: PlatformType) => axios.get(`${API_ENDPOINT}/v2/templates/${platform}`).then((res) => res.data as string | null),
  },
  prototype: {
    createInfo: (versionID: string, diagramID: string, variables: Record<string, any>) =>
      axios.post(`${API_ENDPOINT}/v2/versions/${versionID}/test`, { diagramID, variables }).then((res) => res.data as string),
  },
};

// authorization will rely on the cookie
export default {
  ...voiceflow.generatePublicClient(),
  ...creatorAPI,
};
