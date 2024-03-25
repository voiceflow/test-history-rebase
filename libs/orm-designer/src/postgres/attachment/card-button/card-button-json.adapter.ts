import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCMSObjectJSONAdapter } from '@/postgres/common';

import type { CardButtonJSON, CardButtonObject } from './card-button.interface';

export const CardButtonJSONAdapter = createSmartMultiAdapter<CardButtonObject, CardButtonJSON>(
  PostgresCMSObjectJSONAdapter.fromDB,
  PostgresCMSObjectJSONAdapter.toDB
);
