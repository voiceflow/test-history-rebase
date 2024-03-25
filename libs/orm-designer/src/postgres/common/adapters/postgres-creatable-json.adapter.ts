import { createSmartMultiAdapter } from 'bidirectional-adapter';

import type { PostgresCreatableJSON, PostgresCreatableObject } from '../entities/postgres-creatable.entity';
import { PostgresMutableJSONAdapter } from './postgres-mutable-json.adapter';

export const PostgresCreatableJSONAdapter = createSmartMultiAdapter<PostgresCreatableObject, PostgresCreatableJSON>(
  ({ createdAt, ...data }) => ({
    ...PostgresMutableJSONAdapter.fromDB(data),

    ...(createdAt !== undefined && { createdAt: createdAt.toJSON() }),
  }),
  ({ createdAt, ...data }) => ({
    ...PostgresMutableJSONAdapter.toDB(data),

    ...(createdAt !== undefined && { createdAt: new Date(createdAt) }),
  })
);
