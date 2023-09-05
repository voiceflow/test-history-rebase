import { DesignerClient } from '@voiceflow/sdk-http-designer';

import { DESIGNER_API_ENDPOINT } from '@/config';

import { AUTH_HEADERS } from './constant';

export const designerClient = new DesignerClient({
  headers: AUTH_HEADERS,
  baseURL: DESIGNER_API_ENDPOINT,
});
