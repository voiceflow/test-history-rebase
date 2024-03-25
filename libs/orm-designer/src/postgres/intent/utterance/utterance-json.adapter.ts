import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCMSObjectJSONAdapter } from '@/postgres/common';

import type { UtteranceJSON, UtteranceObject } from './utterance.interface';

export const UtteranceJSONAdapter = createSmartMultiAdapter<UtteranceObject, UtteranceJSON>(
  PostgresCMSObjectJSONAdapter.fromDB,
  PostgresCMSObjectJSONAdapter.toDB
);
