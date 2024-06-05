import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCMSObjectJSONAdapter } from '@/postgres/common';

import type { ResponseMessageJSON, ResponseMessageObject } from './response-message.interface';

export const ResponseMessageJSONAdapter = createSmartMultiAdapter<ResponseMessageObject, ResponseMessageJSON>(
  PostgresCMSObjectJSONAdapter.fromDB,
  PostgresCMSObjectJSONAdapter.toDB
);
