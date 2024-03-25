import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCMSObjectJSONAdapter } from '@/postgres/common';

import type { EntityVariantJSON, EntityVariantObject } from './entity-variant.interface';

export const EntityVariantJSONAdapter = createSmartMultiAdapter<EntityVariantObject, EntityVariantJSON>(
  PostgresCMSObjectJSONAdapter.fromDB,
  PostgresCMSObjectJSONAdapter.toDB
);
