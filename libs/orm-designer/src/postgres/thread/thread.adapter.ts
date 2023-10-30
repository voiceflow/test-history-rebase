import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCreatableJSONAdapter } from '@/postgres/common';
import type { EntityObject, ToJSONWithForeignKeys } from '@/types';

import type { ThreadEntity } from './thread.entity';

export const ThreadJSONAdapter = createSmartMultiAdapter<
  EntityObject<ThreadEntity>,
  ToJSONWithForeignKeys<ThreadEntity>
>(
  ({ deletedAt, ...data }) => ({
    ...PostgresCreatableJSONAdapter.fromDB(data),

    ...(deletedAt !== undefined && { deletedAt: deletedAt?.toJSON() ?? null }),
  }),
  ({ deletedAt, ...data }) => ({
    ...PostgresCreatableJSONAdapter.toDB(data),

    ...(deletedAt !== undefined && { deletedAt: deletedAt ? new Date(deletedAt) : null }),
  })
);
