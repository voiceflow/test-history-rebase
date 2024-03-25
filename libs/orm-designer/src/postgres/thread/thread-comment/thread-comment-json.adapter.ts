import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCreatableJSONAdapter } from '@/postgres/common';

import type { ThreadCommentJSON, ThreadCommentObject } from './thread-comment.interface';

export const ThreadCommentJSONAdapter = createSmartMultiAdapter<ThreadCommentObject, ThreadCommentJSON>(
  ({ deletedAt, ...data }) => ({
    ...PostgresCreatableJSONAdapter.fromDB(data),

    ...(deletedAt !== undefined && { deletedAt: deletedAt?.toJSON() ?? null }),
  }),
  ({ deletedAt, ...data }) => ({
    ...PostgresCreatableJSONAdapter.toDB(data),

    ...(deletedAt !== undefined && { deletedAt: deletedAt ? new Date(deletedAt) : null }),
  })
);
