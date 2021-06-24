import API from '@voiceflow/api-sdk';

import { API_ENDPOINT } from '@/config';

const api = new API({
  clientKey: 'CREATOR_APP',
  apiEndpoint: `${API_ENDPOINT}/v2`,
});

export default api.generatePublicClient();
