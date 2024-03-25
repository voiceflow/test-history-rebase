import { PostgresMutableORM } from '@/postgres/common/orms/postgres-mutable.orm';

import { ThreadCommentEntity } from './thread-comment.entity';
import { ThreadCommentJSONAdapter } from './thread-comment-json.adapter';

export class ThreadCommentORM extends PostgresMutableORM<ThreadCommentEntity> {
  Entity = ThreadCommentEntity;

  jsonAdapter = ThreadCommentJSONAdapter;

  findManyByThreads(threadIDs: number[]) {
    return this.find({ threadID: threadIDs }, { orderBy: { createdAt: 'asc' } });
  }
}
