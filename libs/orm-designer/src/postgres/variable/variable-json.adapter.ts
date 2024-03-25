import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCMSTabularJSONAdapter } from '@/postgres/common';

import type { VariableJSON, VariableObject } from './variable.interface';

export const VariableJSONAdapter = createSmartMultiAdapter<VariableObject, VariableJSON>(
  PostgresCMSTabularJSONAdapter.fromDB,
  PostgresCMSTabularJSONAdapter.toDB
);
