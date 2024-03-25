import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCMSObjectJSONAdapter } from '@/postgres/common';

import type { RequiredEntityJSON, RequiredEntityObject } from './required-entity.interface';

export const RequiredEntityJSONAdapter = createSmartMultiAdapter<RequiredEntityObject, RequiredEntityJSON>(
  PostgresCMSObjectJSONAdapter.fromDB,
  PostgresCMSObjectJSONAdapter.toDB
);
