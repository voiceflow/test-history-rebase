import { PostgresMutableORM } from '@/postgres/common/orms/postgres-mutable.orm';

import { BackupEntity } from './backup.entity';
import { BackupJSONAdapter } from './backup-json.adapter';

export class BackupORM extends PostgresMutableORM<BackupEntity> {
  Entity = BackupEntity;

  jsonAdapter = BackupJSONAdapter;
}
