import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCMSTabularJSONAdapter } from '@/postgres/common';

import type { ResponseJSON, ResponseObject } from './response.interface';

export const ResponseEntityAdapter = createSmartMultiAdapter<ResponseObject, ResponseJSON>(
  PostgresCMSTabularJSONAdapter.fromDB,
  PostgresCMSTabularJSONAdapter.toDB
);
