import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCMSObjectJSONAdapter } from '@/postgres/common';

import type { EventMappingJSON, EventMappingObject } from './event-mapping.interface';

export const EventMappingJSONAdapter = createSmartMultiAdapter<EventMappingObject, EventMappingJSON>(
  PostgresCMSObjectJSONAdapter.fromDB,
  PostgresCMSObjectJSONAdapter.toDB
);
