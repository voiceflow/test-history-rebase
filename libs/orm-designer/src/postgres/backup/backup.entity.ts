import { Entity, Index, PrimaryKey, Property, wrap } from '@mikro-orm/core';

import { CreatedByID, PostgresAbstractEntity, SoftDelete } from '@/postgres/common';
import type { EntityCreateParams, ResolvedForeignKeys, ResolveForeignKeysParams } from '@/types';

@Entity({ schema: 'app_cxd', tableName: 'backup' })
@SoftDelete()
export class BackupsEntity extends PostgresAbstractEntity {
  static resolveForeignKeys<Data extends ResolveForeignKeysParams<BackupsEntity>>(data: Data) {
    return data as ResolvedForeignKeys<BackupsEntity, Data>;
  }

  @PrimaryKey({ type: 'number', autoincrement: true })
  id!: number;

  @Property()
  name: string;

  @Property()
  s3ObjectRef: string;

  @CreatedByID()
  createdByID: number;

  @Property()
  assistantID: string;

  @Index({ name: 'backups_updated_at_idx' })
  @Property({ defaultRaw: 'now()', onUpdate: () => new Date(), type: 'timestamptz' })
  updatedAt: Date = new Date();

  @Index({ name: 'backups_deleted_at_idx' })
  @Property({ default: null, type: 'timestamptz', nullable: true })
  deletedAt: Date | null = null;

  constructor(data: EntityCreateParams<BackupsEntity>) {
    super();

    ({
      assistantID: this.assistantID,
      name: this.name,
      s3ObjectRef: this.s3ObjectRef,
      createdByID: this.createdByID,
    } = BackupsEntity.resolveForeignKeys(data));
  }

  toJSON(...args: any[]) {
    return {
      ...wrap(this).toObject(...args),
    };
  }
}
