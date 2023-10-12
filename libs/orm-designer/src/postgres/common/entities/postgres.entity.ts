import { PrimaryKey, wrap } from '@mikro-orm/core';

import type { BaseEntity } from '@/common/interfaces/base-entity.interface';

import { PostgresAbstractEntity } from './postgres-abstract.entity';

export abstract class PostgresEntity extends PostgresAbstractEntity implements BaseEntity {
  @PrimaryKey({ type: 'int4', nullable: false, autoincrement: true })
  id!: number;

  toJSON(...args: any[]) {
    return wrap(this).toObject(...args);
  }
}
