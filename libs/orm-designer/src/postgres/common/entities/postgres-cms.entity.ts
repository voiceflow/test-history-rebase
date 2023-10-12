import { PrimaryKey, wrap } from '@mikro-orm/core';
import { ObjectId } from 'bson';

import type { BaseEntity } from '@/common/interfaces/base-entity.interface';

import { PostgresAbstractEntity } from './postgres-abstract.entity';

export abstract class PostgresCMSEntity extends PostgresAbstractEntity implements BaseEntity {
  @PrimaryKey({ type: 'varchar', nullable: false, length: 24 })
  id: string = new ObjectId().toJSON();

  toJSON(...args: any[]) {
    return wrap(this).toObject(...args);
  }
}
