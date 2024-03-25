import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCMSTabularJSONAdapter } from '@/postgres/common';

import type { EventJSON, EventObject } from './event.interface';

export const EventJSONAdapter = createSmartMultiAdapter<EventObject, EventJSON>(
  PostgresCMSTabularJSONAdapter.fromDB,
  PostgresCMSTabularJSONAdapter.toDB
);
