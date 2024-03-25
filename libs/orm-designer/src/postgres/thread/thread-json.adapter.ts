import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCreatableJSONAdapter } from '@/postgres/common';

import type { ThreadJSON, ThreadObject } from './thread.interface';

export const ThreadJSONAdapter = createSmartMultiAdapter<ThreadObject, ThreadJSON>(
  ({ deletedAt, ...data }) => ({
    ...PostgresCreatableJSONAdapter.fromDB(data),

    ...(deletedAt !== undefined && { deletedAt: deletedAt?.toJSON() ?? null }),
  }),
  ({ deletedAt, ...data }) => ({
    ...PostgresCreatableJSONAdapter.toDB(data),

    ...(deletedAt !== undefined && { deletedAt: deletedAt ? new Date(deletedAt) : null }),
  })
);
