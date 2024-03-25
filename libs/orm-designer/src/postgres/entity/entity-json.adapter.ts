import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCMSTabularJSONAdapter } from '@/postgres/common';

import type { EntityJSON, EntityObject } from './entity.interface';

export const EntityJSONAdapter = createSmartMultiAdapter<EntityObject, EntityJSON>(
  PostgresCMSTabularJSONAdapter.fromDB,
  PostgresCMSTabularJSONAdapter.toDB
);
