import { MLGatewayClient } from '@voiceflow/sdk-http-ml-gateway';

import { ML_GATEWAY_ENDPOINT } from '@/config';

import { AUTH_HEADERS } from './constant';

export const mlGatewayClient = new MLGatewayClient({
  headers: AUTH_HEADERS,
  baseURL: ML_GATEWAY_ENDPOINT.replace('wss', 'https'),
});
