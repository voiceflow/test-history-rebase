import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCreatableEntityAdapter, ref } from '@/postgres/common';
import type { EntityObject, ToJSONWithForeignKeys } from '@/types';

import { UserStubEntity } from '../stubs/user.stub';
import type { BackupEntity } from './backup.entity';

export const BackupEntityAdapter = createSmartMultiAdapter<
  EntityObject<BackupEntity>,
  ToJSONWithForeignKeys<BackupEntity>,
  [],
  [],
  [['createdBy', 'createdByID']]
>(
  ({ createdBy, ...data }) => ({
    ...PostgresCreatableEntityAdapter.fromDB(data),

    ...(createdBy !== undefined && { createdByID: createdBy.id }),
  }),
  ({ createdByID, ...data }) => ({
    ...PostgresCreatableEntityAdapter.toDB(data),

    ...(createdByID !== undefined && { createdBy: ref(UserStubEntity, createdByID) }),
  })
);
