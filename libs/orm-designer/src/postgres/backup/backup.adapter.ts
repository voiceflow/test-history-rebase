import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCreatableJSONAdapter, ref } from '@/postgres/common';
import type { EntityObject, ToJSONWithForeignKeys } from '@/types';

import { UserStubEntity } from '../stubs/user.stub';
import type { BackupEntity } from './backup.entity';

export const BackupJSONAdapter = createSmartMultiAdapter<
  EntityObject<BackupEntity>,
  ToJSONWithForeignKeys<BackupEntity>,
  [],
  [],
  [['createdBy', 'createdByID']]
>(
  ({ createdBy, ...data }) => ({
    ...PostgresCreatableJSONAdapter.fromDB(data),

    ...(createdBy !== undefined && { createdByID: createdBy.id }),
  }),
  ({ createdByID, ...data }) => ({
    ...PostgresCreatableJSONAdapter.toDB(data),

    ...(createdByID !== undefined && { createdBy: ref(UserStubEntity, createdByID) }),
  })
);
