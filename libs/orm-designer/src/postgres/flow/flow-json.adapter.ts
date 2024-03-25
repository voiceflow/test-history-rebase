import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCMSTabularJSONAdapter } from '@/postgres/common';

import type { FlowJSON, FlowObject } from './flow.interface';

export const FlowJSONAdapter = createSmartMultiAdapter<FlowObject, FlowJSON>(
  PostgresCMSTabularJSONAdapter.fromDB,
  PostgresCMSTabularJSONAdapter.toDB
);
