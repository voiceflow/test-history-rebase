import API from '@voiceflow/api-sdk';
import { Crypto } from '@voiceflow/common';
import AES from 'crypto-js/aes';

import { API_ENDPOINT } from '@/config';

const api = new API({
  clientKey: 'CREATOR_APP',
  apiEndpoint: `${API_ENDPOINT}/v2`,
});

const analyticsEncryption = new Crypto.Synchronous({ alg: AES, key: 'vf-analytics' });

export default api.generatePublicClient({
  analyticsEncryption,
});

export const apiV3 = new API({
  clientKey: 'CREATOR_APP',
  apiEndpoint: `${API_ENDPOINT}/v3`,
}).generatePublicClient({
  analyticsEncryption,
});
