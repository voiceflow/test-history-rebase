import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCMSObjectJSONAdapter } from '@/postgres/common';

import type { ResponseDiscriminatorJSON, ResponseDiscriminatorObject } from './response-discriminator.interface';

export const ResponseDiscriminatorJSONAdapter = createSmartMultiAdapter<
  ResponseDiscriminatorObject,
  ResponseDiscriminatorJSON
>(PostgresCMSObjectJSONAdapter.fromDB, PostgresCMSObjectJSONAdapter.toDB);
