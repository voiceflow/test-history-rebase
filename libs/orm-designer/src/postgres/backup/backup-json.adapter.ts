import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCreatableJSONAdapter } from '@/postgres/common';

import type { BackupJSON, BackupObject } from './backup.interface';

export const BackupJSONAdapter = createSmartMultiAdapter<BackupObject, BackupJSON>(
  PostgresCreatableJSONAdapter.fromDB,
  PostgresCreatableJSONAdapter.toDB
);
