import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCMSObjectJSONAdapter } from '@/postgres/common';

import type { ConditionAssertionJSON, ConditionAssertionObject } from './condition-assertion.interface';

export const ConditionAssertionJSONAdapter = createSmartMultiAdapter<ConditionAssertionObject, ConditionAssertionJSON>(
  PostgresCMSObjectJSONAdapter.fromDB,
  PostgresCMSObjectJSONAdapter.toDB
);
