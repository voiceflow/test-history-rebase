import Voiceflow from '@voiceflow/api-sdk';

import { API_ENDPOINT } from '@/config';

export const voiceflow = new Voiceflow({
  clientKey: 'CREATOR_APP',
  apiEndpoint: `${API_ENDPOINT}/v2`,
});

// authorization will rely on the cookie
export default voiceflow.generatePublicClient();
