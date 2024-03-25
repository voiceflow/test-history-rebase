import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCMSTabularJSONAdapter } from '@/postgres/common';

import type { FunctionJSON, FunctionObject } from './function.interface';

export const FunctionJSONAdapter = createSmartMultiAdapter<FunctionObject, FunctionJSON>(
  PostgresCMSTabularJSONAdapter.fromDB,
  PostgresCMSTabularJSONAdapter.toDB
);
