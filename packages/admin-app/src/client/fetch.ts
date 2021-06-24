import { createFetch } from '@voiceflow/ui';

import { API_ENDPOINT } from '@/config';

const fetch = createFetch(API_ENDPOINT);

export type Fetch = typeof fetch;

export default fetch;

export const api = fetch;
