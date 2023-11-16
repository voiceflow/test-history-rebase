import { PostgresMutableORM } from '@/postgres/common/postgres-mutable.orm';
import type { PKOrEntity } from '@/types';

import type { ThreadEntity } from '../thread.entity';
import { ThreadCommentEntity } from './thread-comment.entity';

export class ThreadCommentORM extends PostgresMutableORM(ThreadCommentEntity) {
  findManyByThreads(threads: PKOrEntity<ThreadEntity>[]) {
    return this.find({ thread: threads }, { orderBy: { createdAt: 'ASC' } });
  }
}
