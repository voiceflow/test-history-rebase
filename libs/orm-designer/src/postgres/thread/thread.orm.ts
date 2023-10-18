import { PostgresMutableORM } from '@/postgres/common/postgres-mutable.orm';

import { ThreadEntity } from './thread.entity';

export class ThreadORM extends PostgresMutableORM(ThreadEntity) {}
