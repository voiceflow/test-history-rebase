import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCMSObjectJSONAdapter } from '@/postgres/common';

import type { FunctionPathJSON, FunctionPathObject } from './function-path.interface';

export const FunctionPatchJSONAdapter = createSmartMultiAdapter<FunctionPathObject, FunctionPathJSON>(
  PostgresCMSObjectJSONAdapter.fromDB,
  PostgresCMSObjectJSONAdapter.toDB
);
