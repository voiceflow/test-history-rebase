import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCreatableEntityAdapter } from '@/postgres/common';
import type { EntityObject, ToJSONWithForeignKeys } from '@/types';

import type { ThreadEntity } from './thread.entity';

export const ThreadEntityAdapter = createSmartMultiAdapter<
  EntityObject<ThreadEntity>,
  ToJSONWithForeignKeys<ThreadEntity>
>(
  ({ deletedAt, ...data }) => ({
    ...PostgresCreatableEntityAdapter.fromDB(data),

    ...(deletedAt !== undefined && { deletedAt: deletedAt?.toJSON() ?? null }),
  }),
  ({ deletedAt, ...data }) => ({
    ...PostgresCreatableEntityAdapter.toDB(data),

    ...(deletedAt !== undefined && { deletedAt: deletedAt ? new Date(deletedAt) : null }),
  })
);
