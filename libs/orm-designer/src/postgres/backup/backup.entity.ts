import { Entity, Property, wrap } from '@mikro-orm/core';

import { CreatedByID, PostgresCreatableEntity } from '@/postgres/common';
import type { EntityCreateParams, ToJSONWithForeignKeys } from '@/types';

import { BackupJSONAdapter } from './backup.adapter';

@Entity({ schema: 'app_cxd', tableName: 'backup' })
export class BackupEntity extends PostgresCreatableEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<BackupEntity>>>(data: JSON) {
    return BackupJSONAdapter.toDB<JSON>(data);
  }

  @Property()
  name: string;

  @Property({ name: 's3_object_ref' })
  s3ObjectRef: string;

  @CreatedByID()
  createdByID: number;

  @Property()
  assistantID: string;

  constructor(data: EntityCreateParams<BackupEntity>) {
    super();

    ({
      assistantID: this.assistantID,
      name: this.name,
      s3ObjectRef: this.s3ObjectRef,
      createdByID: this.createdByID,
    } = BackupEntity.fromJSON(data));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<BackupEntity> {
    return BackupJSONAdapter.fromDB(wrap<BackupEntity>(this).toObject(...args));
  }
}
