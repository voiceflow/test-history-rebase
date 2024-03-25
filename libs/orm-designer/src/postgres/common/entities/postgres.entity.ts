import { PrimaryKey } from '@mikro-orm/core';

import type { PostgresPKEntity } from '@/types';

import { PostgresAbstractEntity } from './postgres-abstract.entity';

export abstract class PostgresEntity<DefaultOrNullColumn extends string = never>
  extends PostgresAbstractEntity<DefaultOrNullColumn | 'id'>
  implements PostgresPKEntity
{
  @PrimaryKey({ type: 'int4', nullable: false, autoincrement: true })
  id!: number;
}
