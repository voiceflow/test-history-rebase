import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCMSTabularJSONAdapter } from '@/postgres/common';

import type { IntentJSON, IntentObject } from './intent.interface';

export const IntentJSONAdapter = createSmartMultiAdapter<IntentObject, IntentJSON>(
  PostgresCMSTabularJSONAdapter.fromDB,
  PostgresCMSTabularJSONAdapter.toDB
);
