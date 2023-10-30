import { PrimaryKey } from '@mikro-orm/core';

import type { BaseEntity } from '@/common/interfaces/base-entity.interface';
import type { ToJSON } from '@/types';

import { PostgresAbstractEntity } from './postgres-abstract.entity';

export abstract class PostgresEntity extends PostgresAbstractEntity implements BaseEntity {
  @PrimaryKey({ type: 'int4', nullable: false, autoincrement: true })
  id!: number;

  abstract toJSON(): ToJSON<PostgresEntity>;
}
