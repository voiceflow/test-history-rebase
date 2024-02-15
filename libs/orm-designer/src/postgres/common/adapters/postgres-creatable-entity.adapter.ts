import { createSmartMultiAdapter } from 'bidirectional-adapter';

import type { EntityObject, ToJSONWithForeignKeys } from '@/types';

import type { PostgresCreatableEntity } from '../entities/postgres-creatable.entity';
import { PostgresMutableEntityAdapter } from './postgres-mutable-entity.adapter';

export const PostgresCreatableEntityAdapter = createSmartMultiAdapter<
  EntityObject<PostgresCreatableEntity>,
  ToJSONWithForeignKeys<PostgresCreatableEntity>
>(
  ({ createdAt, ...data }) => ({
    ...PostgresMutableEntityAdapter.fromDB(data),

    ...(createdAt !== undefined && { createdAt: createdAt.toJSON() }),
  }),
  ({ createdAt, ...data }) => ({
    ...PostgresMutableEntityAdapter.toDB(data),

    ...(createdAt !== undefined && { createdAt: new Date(createdAt) }),
  })
);
