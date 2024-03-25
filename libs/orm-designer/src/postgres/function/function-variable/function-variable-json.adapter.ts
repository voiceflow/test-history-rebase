import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCMSObjectJSONAdapter } from '@/postgres/common';

import type { FunctionVariableJSON, FunctionVariableObject } from './function-variable.interface';

export const FunctionVariableJSONAdapter = createSmartMultiAdapter<FunctionVariableObject, FunctionVariableJSON>(
  PostgresCMSObjectJSONAdapter.fromDB,
  PostgresCMSObjectJSONAdapter.toDB
);
