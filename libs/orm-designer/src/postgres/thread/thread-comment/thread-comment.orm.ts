import { PostgresMutableORM } from '@/postgres/common/postgres-mutable.orm';

import { ThreadCommentEntity } from './thread-comment.entity';

export class ThreadCommentORM extends PostgresMutableORM(ThreadCommentEntity) {}
