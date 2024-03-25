import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCMSObjectJSONAdapter } from '@/postgres/common/adapters/postgres-cms-object-json.adapter';

import type { AssistantJSON, AssistantObject } from './assistant.interface';

export const AssistantJSONAdapter = createSmartMultiAdapter<AssistantObject, AssistantJSON>(
  PostgresCMSObjectJSONAdapter.fromDB,
  PostgresCMSObjectJSONAdapter.toDB
);
