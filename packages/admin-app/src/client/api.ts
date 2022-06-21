import API from '@voiceflow/api-sdk';

import { API_ENDPOINT } from '@/config';

const api = new API({
  apiEndpoint: `${API_ENDPOINT}/v2`,
  clientKey: 'CREATOR_APP',
});

export default api.generatePublicClient();
