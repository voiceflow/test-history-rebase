import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCreatableEntityAdapter, ref } from '@/postgres/common';
import type { EntityObject, ToJSONWithForeignKeys } from '@/types';

import { UserStubEntity } from '../../stubs/user.stub';
import { ThreadEntity } from '../thread.entity';
import type { ThreadCommentEntity } from './thread-comment.entity';

export const ThreadCommentEntityAdapter = createSmartMultiAdapter<
  EntityObject<ThreadCommentEntity>,
  ToJSONWithForeignKeys<ThreadCommentEntity>,
  [],
  [],
  [['thread', 'threadID'], ['author', 'authorID']]
>(
  ({ thread, author, deletedAt, ...data }) => ({
    ...PostgresCreatableEntityAdapter.fromDB(data),

    ...(thread !== undefined && { threadID: thread.id }),

    ...(author !== undefined && { authorID: author.id }),

    ...(deletedAt !== undefined && { deletedAt: deletedAt?.toJSON() ?? null }),
  }),
  ({ authorID, threadID, deletedAt, ...data }) => ({
    ...PostgresCreatableEntityAdapter.toDB(data),

    ...(threadID !== undefined && { thread: ref(ThreadEntity, threadID) }),

    ...(authorID !== undefined && { author: ref(UserStubEntity, authorID) }),

    ...(deletedAt !== undefined && { deletedAt: deletedAt ? new Date(deletedAt) : null }),
  })
);
