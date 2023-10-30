import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCreatableJSONAdapter, ref } from '@/postgres/common';
import type { EntityObject, ToJSONWithForeignKeys } from '@/types';

import { UserStubEntity } from '../../stubs/user.stub';
import { ThreadEntity } from '../thread.entity';
import type { ThreadCommentEntity } from './thread-comment.entity';

export const ThreadCommentJSONAdapter = createSmartMultiAdapter<
  EntityObject<ThreadCommentEntity>,
  ToJSONWithForeignKeys<ThreadCommentEntity>,
  [],
  [],
  [['thread', 'threadID'], ['author', 'authorID']]
>(
  ({ thread, author, deletedAt, ...data }) => ({
    ...PostgresCreatableJSONAdapter.fromDB(data),

    ...(thread !== undefined && { threadID: thread.id }),

    ...(author !== undefined && { authorID: author.id }),

    ...(deletedAt !== undefined && { deletedAt: deletedAt?.toJSON() ?? null }),
  }),
  ({ authorID, threadID, deletedAt, ...data }) => ({
    ...PostgresCreatableJSONAdapter.toDB(data),

    ...(threadID !== undefined && { thread: ref(ThreadEntity, threadID) }),

    ...(authorID !== undefined && { author: ref(UserStubEntity, authorID) }),

    ...(deletedAt !== undefined && { deletedAt: deletedAt ? new Date(deletedAt) : null }),
  })
);
