import { PostgresMutableORM } from '@/postgres/common/postgres-mutable.orm';

import { BackupsEntity as BackupEntity } from './backup.entity';

export class BackupORM extends PostgresMutableORM(BackupEntity) {}
