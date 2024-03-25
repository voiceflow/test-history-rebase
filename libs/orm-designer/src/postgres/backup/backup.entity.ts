import { Entity, Property } from '@mikro-orm/core';

import { CreatedByID, PostgresCreatableEntity } from '@/postgres/common';
import type { Ref } from '@/types';

import type { UserStubEntity } from '../stubs/user.stub';

@Entity({ schema: 'app_cxd', tableName: 'backup' })
export class BackupEntity extends PostgresCreatableEntity {
  @Property()
  name!: string;

  @CreatedByID()
  createdBy!: Ref<UserStubEntity>;

  @Property({ name: 's3_object_ref' })
  s3ObjectRef!: string;

  @Property()
  assistantID!: string;
}
