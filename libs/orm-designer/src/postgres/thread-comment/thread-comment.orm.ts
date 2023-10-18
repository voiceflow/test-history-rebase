import { PostgresMutableORM } from '@/postgres/common/postgres-mutable.orm';

import { ThreadCommentEntity } from './thread-comment.entity';

export class ThreadORM extends PostgresMutableORM(ThreadCommentEntity) {}
