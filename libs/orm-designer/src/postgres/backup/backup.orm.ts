import { PostgresMutableORM } from '@/postgres/common/postgres-mutable.orm';

import { BackupEntity } from './backup.entity';

export class BackupORM extends PostgresMutableORM(BackupEntity) {}
