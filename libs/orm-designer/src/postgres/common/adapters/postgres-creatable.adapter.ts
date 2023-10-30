import { createSmartMultiAdapter } from 'bidirectional-adapter';

import type { EntityObject, ToJSONWithForeignKeys } from '@/types';

import type { PostgresCreatableEntity } from '../entities/postgres-creatable.entity';
import { PostgresMutableJSONAdapter } from './postgres-mutable.adapter';

export const PostgresCreatableJSONAdapter = createSmartMultiAdapter<
  EntityObject<PostgresCreatableEntity>,
  ToJSONWithForeignKeys<PostgresCreatableEntity>
>(
  ({ createdAt, ...data }) => ({
    ...PostgresMutableJSONAdapter.fromDB(data),

    ...(createdAt !== undefined && { createdAt: createdAt.toJSON() }),
  }),
  ({ createdAt, ...data }) => ({
    ...PostgresMutableJSONAdapter.toDB(data),

    ...(createdAt !== undefined && { createdAt: new Date(createdAt) }),
  })
);
