import { Entity, Property, wrap } from '@mikro-orm/core';

import { CreatedByID, PostgresCreatableEntity } from '@/postgres/common';
import type { EntityCreateParams, Ref, ToJSONWithForeignKeys } from '@/types';

import type { UserStubEntity } from '../stubs/user.stub';
import { BackupEntityAdapter } from './backup-entity.adapter';

@Entity({ schema: 'app_cxd', tableName: 'backup' })
export class BackupEntity extends PostgresCreatableEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<BackupEntity>>>(data: JSON) {
    return BackupEntityAdapter.toDB<JSON>(data);
  }

  @Property()
  name: string;

  @CreatedByID()
  createdBy: Ref<UserStubEntity>;

  @Property({ name: 's3_object_ref' })
  s3ObjectRef: string;

  @Property()
  assistantID: string;

  constructor(data: EntityCreateParams<BackupEntity>) {
    super();

    ({
      name: this.name,
      createdBy: this.createdBy,
      assistantID: this.assistantID,
      s3ObjectRef: this.s3ObjectRef,
    } = BackupEntity.fromJSON(data));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<BackupEntity> {
    return BackupEntityAdapter.fromDB({
      ...wrap<BackupEntity>(this).toObject(...args),
      createdBy: this.createdBy,
    });
  }
}
