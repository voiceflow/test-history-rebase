import { createFetch } from '@voiceflow/ui';

import { ALEXA_SERVICE_ENDPOINT, API_ENDPOINT, API_V2_ENDPOINT, API_V3_ENDPOINT, GENERAL_SERVICE_ENDPOINT } from '@/config';

const fetch = createFetch(API_ENDPOINT);

export type Fetch = typeof fetch;

export default fetch;

export const api = fetch;

export const apiV2 = createFetch(API_V2_ENDPOINT);

export const apiV3 = createFetch(API_V3_ENDPOINT);

export const alexaService = createFetch(ALEXA_SERVICE_ENDPOINT);
export const generalService = createFetch(GENERAL_SERVICE_ENDPOINT);
