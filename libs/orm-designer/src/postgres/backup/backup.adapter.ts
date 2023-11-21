import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCreatableJSONAdapter } from '@/postgres/common';
import type { EntityObject, ToJSONWithForeignKeys } from '@/types';

import type { BackupEntity } from './backup.entity';

export const BackupJSONAdapter = createSmartMultiAdapter<
  EntityObject<BackupEntity>,
  ToJSONWithForeignKeys<BackupEntity>
>(
  (data) => PostgresCreatableJSONAdapter.fromDB(data),
  (data) => PostgresCreatableJSONAdapter.toDB(data)
);
